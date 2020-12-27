#include <ModbusSlave.h>
#include <avr/wdt.h>

// Explicitly set a stream to use the Serial port.
Modbus slave(Serial, 11, 2); // stream = Serial, slave id = 1, rs485 control-pin = 2
#define SPEED 57600
#define _BV(bit) (1 << (bit))

// В отдном массиве, что бы по модбасу удобнне отдавать было
//                   |----Сенсоры--------|---Насосы-----------|          
//                    0  1  2  3  4  5  6  0  1  2  3  4  5  6
int statuses[16]   = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
char channel_map[7] = {3, 0, 1, 2, 4, 7, 5};
char pump_map[7] =   {3, 4, 8, 7, 5, 6, 9};

int channel_count = 7;
// 0 - 3
// 1 - 4
// 2 - 9
// 3 - 7
// 4 - 5
// 5 - 6
// 6 
// 7


void setup() {
  // wdt_reset(); // reset watchdog counter
  // wdt_disable();
  // wdt_enable(WDTO_8S); // watchdog 8s timeout

  DDRD |= _BV(PD2); // RS-485 control pin
  Serial.begin(SPEED);
  Serial.println("START");
  slave.begin(SPEED);

  // TIMER 1 for interrupt frequency 4 Hz:
  cli(); // stop interrupts
  TCCR1A = 0; // set entire TCCR1A register to 0
  TCCR1B = 0; // same for TCCR1B
  TCNT1  = 0; // initialize counter value to 0
  // set compare match register for 4 Hz increments
  OCR1A = 62499; // = 16000000 / (64 * 4) - 1 (must be <65536)
  // turn on CTC mode
  TCCR1B |= (1 << WGM12);
  // Set CS12, CS11 and CS10 bits for 64 prescaler
  TCCR1B |= (0 << CS12) | (1 << CS11) | (1 << CS10);
  // enable timer compare interrupt
  TIMSK1 |= (1 << OCIE1A);
  sei(); // allow interrupts

  slave.cbVector[CB_READ_HOLDING_REGISTERS] = readValues;
  slave.cbVector[CB_WRITE_HOLDING_REGISTERS] = writeValues;

  for (char i = 0; i != channel_count; ++i) {
    pinMode(pump_map[i], OUTPUT);
  }

  // Когда сделал долбанутую разводку...
  pinMode(13, OUTPUT);
  pinMode(A1, OUTPUT);
  pinMode(A2, OUTPUT);
    
  pinMode(A3, INPUT);
}

// Номер канала - 13 - первый бит, A1 - второй бит, A2 - третий бит

void loop() {
    slave.poll();
}

unsigned int step = 0;
unsigned int sensor_num = 0;


ISR(TIMER1_COMPA_vect){
  // Считываю с сенсоров    
  switch (step) { 
      case 0: {
          // Нужный канал
          char channel = channel_map[sensor_num];
          digitalWrite(13, channel % 2);
          digitalWrite(A1, (channel >> 1) % 2);
          digitalWrite(A2, (channel >> 2) % 2);
        break;
      }
      case 1: {
        statuses[sensor_num] = analogRead(A3);
        break;
      }
      // Немного меньше шума
      case 2: {          
          digitalWrite(13, false);
          digitalWrite(A1, true);
          digitalWrite(A2, true);
        break;
      }
      // Немного меньше шума, подождем немного и поменяем канал
      case 3: {
        sensor_num = (sensor_num + 1) % channel_count;
        break;
      }
  }

  step = (step + 1) % 4;
  statuses[14] = sensor_num;

  for (uint16_t i = 0; i != 7; ++i) {
      char channel = pump_map[i];      
      if (statuses[i + 7] > 0) {
        digitalWrite(channel, 1);
        statuses[i + 7]--;
        statuses[15] = channel;
      } else {
        digitalWrite(channel, 0);
      }
  }
}


uint8_t readValues(uint8_t fc, uint16_t address, uint16_t length) {
    if (address > channel_count * 2 || (address + length) > (channel_count * 2 + 2)) {
        return STATUS_ILLEGAL_DATA_ADDRESS;
    }

    for (uint8_t i = 0; i != length; ++i) {
        slave.writeRegisterToBuffer(i, statuses[address + i]);
    }
    return STATUS_OK;
}

uint8_t writeValues(uint8_t fc, uint16_t address, uint16_t length) {
    if (address > channel_count || (address + length) > channel_count) {
        return STATUS_ILLEGAL_DATA_ADDRESS;
    }

    for (uint8_t i = 0; i != length; ++i) {
        uint16_t value = slave.readRegisterFromBuffer(address + i);
        statuses[i + 7] = value;
    }
    return STATUS_OK;
}

