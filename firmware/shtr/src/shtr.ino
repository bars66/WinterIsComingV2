#include <ModbusSlave.h>

// Explicitly set a stream to use the Serial port.
Modbus slave(Serial, 10, 2); // stream = Serial, slave id = 1, rs485 control-pin = 2
#define SPEED 57600
#define _BV(bit) (1 << (bit))

#define IDLE 0
#define WAIT 1
#define RUN 2
#define WAIT_FOR_FINISH 3

#define ROTATE_LEFT 0
#define ROTATE_RIGHT 1


struct Pins {
  volatile uint8_t * ena_port;
  volatile uint8_t * ena_init;
  uint8_t ena_pin;

  volatile uint8_t * pul_port;
  volatile uint8_t * pul_init;
  uint8_t pul_pin;

  volatile uint8_t * dir_port;
  volatile uint8_t * dir_init;
  uint8_t dir_pin;
};

Pins pin1 = {
  ena_port: &PORTB,
  ena_init: &DDRB,
  ena_pin: _BV(PB0),

  pul_port: &PORTD,
  pul_init: &DDRD,
  pul_pin: _BV(PD7),

  dir_port: &PORTD,
  dir_init: &DDRD,
  dir_pin: _BV(PD6),
};

Pins pin2 = {
  ena_port: &PORTD,
  ena_init: &DDRD,
  ena_pin: _BV(PD5),

  pul_port: &PORTD,
  pul_init: &DDRD,
  pul_pin: _BV(PD4),

  dir_port: &PORTD,
  dir_init: &DDRD,
  dir_pin: _BV(PD3),
};

Pins pin3 = {
  ena_port: &PORTB,
  ena_init: &DDRB,
  ena_pin: _BV(PB2),

  pul_port: &PORTB,
  pul_init: &DDRB,
  pul_pin: _BV(PB3),

  dir_port: &PORTB,
  dir_init: &DDRB,
  dir_pin: _BV(PB4),
};


class StepMotorChannel {
  public: 
    StepMotorChannel(struct Pins &pin) {
      this->status = IDLE;
      this->value_for_set = 0;
      this->_value = 0;
      this->_value_step = 0;
      this->direction = 0;
      this->pin = pin;
    };

    void initChannel() {
      (*this->pin.ena_init) |= this->pin.ena_pin;
      (*this->pin.pul_init) |= this->pin.pul_pin;
      (*this->pin.dir_init) |= this->pin.dir_pin;
      this->disable();
    }

    void addMoveFromModbus(uint16_t value) {
      if (value == 0) return;
      
      int16_t val = static_cast<int16_t>(value) - (1 << 15);
      uint8_t dir = value < (1 << 15) ? ROTATE_LEFT : ROTATE_RIGHT;
      val = val < 0 ? -1 * val : val;

      this->addMove(dir, val);
    }

    void addMove(uint8_t direction, uint16_t value) {
      if (value == 0 || value > 10000) return;
      this->value_for_set = value;
      this->_value = value;
      this->_value_step = 0;
      this->_sleep_value = 120;
      this->direction = direction;
      
      status = WAIT;      
    }

    bool isActive() {
      return status != IDLE;
    }

    void execute() {
      if (!this->isActive()) return;

      if (this->_sleep_value == 0) {
        this->status = IDLE;
        this->disable();
      }

      // Если быстро отключить двигатель, то он не успевает отработать все шаги.
      if (this->_value == 0 && this->_sleep_value != 0) {
        this->status = WAIT_FOR_FINISH;
        --this->_sleep_value;
        
        return;
      }

      if (this->status == WAIT) {
        this->status = RUN;
        this->enable();
        this->setDirection();
        return;
      }

      switch(this->_value_step) {
        // Начинаем импульс
        case 0:
          this->_value_step = 1;
          (*this->pin.pul_port) |= this->pin.pul_pin;
          return;
          
        // Заканчиваем импульс
        case 1: 
          this->_value_step = 0;
          --this->_value;          
         (*this->pin.pul_port) &= ~ this->pin.pul_pin;
          return;
      }
    }

    uint16_t getValue() {
      return this->_value;
    }

    uint16_t getStatus() {
      return this->status;
    }

  private:
    uint8_t status;
    uint16_t value_for_set;
    uint16_t _value;
    uint16_t _value_step;
    uint16_t _sleep_value;
    uint8_t direction;
    
    Pins pin;  

    void enable() {
      (*this->pin.ena_port) &= ~ this->pin.ena_pin;
    }

    void disable() {
      (*this->pin.ena_port) |= this->pin.ena_pin;
    }

    void setDirection() {
      if (this->direction == ROTATE_LEFT) {
        (*this->pin.dir_port) &= ~ this->pin.dir_pin;
      } else {
        (*this->pin.dir_port) |= this->pin.dir_pin;
      }
    }
};

//
StepMotorChannel channels[] = {StepMotorChannel(pin1), StepMotorChannel(pin2), StepMotorChannel(pin3)};
uint8_t channels_count = sizeof(channels) / sizeof(channels[0]);

void setup() {
  DDRD |= _BV(PD2); // RS-485 control pin
  Serial.begin(SPEED);
  slave.begin(SPEED);

  for (uint8_t i = 0; i != channels_count; ++i) {
    channels[i].initChannel();
  }

  // http://www.8bit-era.cz/arduino-timer-interrupts-calculator.html
  // TIMER 1 for interrupt frequency 1666.1459960429033 Hz:
  cli(); // stop interrupts
  TCCR1A = 0; // set entire TCCR1A register to 0
  TCCR1B = 0; // same for TCCR1B
  TCNT1  = 0; // initialize counter value to 0
  // set compare match register for 1666.1459960429033 Hz increments
  OCR1A = 9602; // = 16000000 / (1 * 1666.1459960429033) - 1 (must be <65536)
  // turn on CTC mode
  TCCR1B |= (1 << WGM12);
  // Set CS12, CS11 and CS10 bits for 1 prescaler
  TCCR1B |= (0 << CS12) | (0 << CS11) | (1 << CS10);
  // enable timer compare interrupt
  TIMSK1 |= (1 << OCIE1A);
  sei(); // allow interrupts
  
  slave.cbVector[CB_READ_HOLDING_REGISTERS] = readValues;
  slave.cbVector[CB_WRITE_HOLDING_REGISTERS] = writeValues;
}

void loop() {
    slave.poll();
}

ISR(TIMER1_COMPA_vect){
  for (uint8_t i = 0; i != channels_count; ++i) {
    channels[i].execute();
  }
}

uint8_t readValues(uint8_t fc, uint16_t address, uint16_t length) {
    if (address > channels_count || (address + length) > channels_count) {
        return STATUS_ILLEGAL_DATA_ADDRESS;
    }

    for (uint8_t i = 0; i != length; ++i) {
        slave.writeRegisterToBuffer(i, channels[address + i].getStatus());
    }
    return STATUS_OK;
}

uint8_t writeValues(uint8_t fc, uint16_t address, uint16_t length) {
    if (address > channels_count || (address + length) > channels_count) {
        return STATUS_ILLEGAL_DATA_ADDRESS;
    }

    for (uint8_t i = 0; i != length; ++i) {
        if (channels[address + i].getStatus() == IDLE) {
          
           uint16_t value = slave.readRegisterFromBuffer(address + i);
           channels[address + i].addMoveFromModbus(value);
        }
    }
    return STATUS_OK;
}

