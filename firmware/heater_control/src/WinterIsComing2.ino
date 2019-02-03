#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 10
#define TEMPERATURE_PRECISION 9
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DeviceAddress insideThermometer, canalTemperature;

unsigned long time = 0;
unsigned long freqCounter = 0;
long timeDeltaSumm = 0;
unsigned long timeDelta = 0;
long value = 0;
long heaterPower = 5;
long heaterPowerAvg = 0;
int heaterPowerAvgCount = 0;

float canaltTmp = 40;
float insideTmp = 0;
bool heaterEnabled = true;
bool ventEnabled = true;
double percents = 0;
const int interruptPin = 2;
const int switchPin = 4;
const int heaterPin = 5;
const int MAX_CANAL_TEMP = 50;
const int TMP_DELTA = 1;
const int MAX_HEATER_POWER = 9;
float tmp = 24.5;

const double MICROS_IN_SECONDS = 1000000.0;

void setup() {
  Serial.begin(38400);
  pinMode(interruptPin, INPUT);
  pinMode(switchPin, OUTPUT);
  pinMode(heaterPin, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(interruptPin), updateFrequency, FALLING);


  sensors.begin();
  sensors.getAddress(canalTemperature, 0);
  sensors.getAddress(insideThermometer, 1);
  sensors.setResolution(canalTemperature, TEMPERATURE_PRECISION);
  sensors.setResolution(insideThermometer, TEMPERATURE_PRECISION); 
}

const int K = 5;

bool isInfoTick() {
  return freqCounter % 500 == 0;
}


bool isTempTick() {
  return freqCounter % 100 == 0;
}

void loop() {
    if (insideTmp < -50 || canaltTmp < -50) {
      if (canaltTmp >= MAX_CANAL_TEMP && isInfoTick()) {
          Serial.print("F=");
          Serial.println("TEMP_RANGE_ERROR: < -50");
      }

      heaterEnabled = false; 
    }

    
    if (tmp > 35 || tmp < 10) {
      if (canaltTmp >= MAX_CANAL_TEMP && isInfoTick()) {
          Serial.print("F=");
          Serial.println("TEMP_RANGE_ERROR: 10-35");
      }

      digitalWrite(heaterPin, LOW);
      digitalWrite(switchPin, LOW);
      
      ventEnabled = false;
      heaterEnabled = false;
    }
    
    if (ventEnabled || heaterEnabled || canaltTmp > 25) {
        digitalWrite(switchPin, HIGH);
    } else {
        digitalWrite(switchPin, LOW);
    }

    if (heaterEnabled && ventEnabled && heaterPower && freqCounter % 10 <= heaterPower && canaltTmp < MAX_CANAL_TEMP) {
      digitalWrite(heaterPin, HIGH);
    } else {
      if (canaltTmp >= MAX_CANAL_TEMP && isInfoTick()) {
          Serial.print("F=");
          Serial.println("MAX_CANAL_TMP");
      }
      
      digitalWrite(heaterPin, LOW);
    }

    if (isTempTick()) {
      sensors.requestTemperaturesByAddress(canalTemperature);
      canaltTmp = sensors.getTempC(canalTemperature);
      if (freqCounter % 3000 == 0) {
        sensors.requestTemperaturesByAddress(insideThermometer);
      }
      insideTmp = sensors.getTempC(insideThermometer);

      float value = K * (tmp - min(insideTmp, canaltTmp - 2.5));
  
      if (value < 0) {
        value = 0;
//        value *= -1;
//        if (value > MAX_HEATER_POWER) {
//          value = MAX_HEATER_POWER;
//        }
//  
//        value = (MAX_HEATER_POWER - value);
      } else {
        if (value > MAX_HEATER_POWER) {
          value = MAX_HEATER_POWER;
        }
      }
  

      
      heaterPower = value;
    
      
      if (!heaterEnabled) {
        heaterPower = 0;
      }

      heaterPowerAvg += heaterPower;
      heaterPowerAvgCount++;
    }

    if (isInfoTick()) {
      Serial.print("I=");
      Serial.print(canaltTmp);
      Serial.print(";");
      Serial.print(insideTmp);
      Serial.print(";");
      Serial.print(timeDelta);
      Serial.print(";");
      Serial.print(heaterPowerAvg);
      Serial.print(";");
      Serial.print(ventEnabled);
      Serial.print(";");
      Serial.print(heaterEnabled);
      Serial.print(";");
      Serial.print(tmp);
      Serial.println("");

      heaterPowerAvg = 0;
      heaterPowerAvgCount = 0;
      if (Serial.available()) {
        String s = Serial.readString();
        if (s.length() > 5) {
          Serial.println(int(s[0]));
          ventEnabled = int(s[0]) == 49;
          heaterEnabled = int(s[1]) == 49;
          if (!ventEnabled) {
            heaterEnabled = false;
          }
  
          s = s.substring(3);
          tmp = s.toFloat();
        }
      }
    }
//  if (timeDelta < 8000 || timeDelta > 12000) return;
//
//   if (Serial.available()) {
//    int tempValue = Serial.parseInt();
//    if (tempValue) {
//        value = tempValue;
//        Serial.println(value);
//        percents = value / 100.0;
//    }
//  }
//
//
//  if (value == 100) {
//    digitalWrite(switchPin, HIGH);
//    return;
//  }
//
//
//  if (value == 1) {
//    digitalWrite(switchPin, LOW);
//    return;
//  }
//
//  unsigned long timeNow = micros();
//  if ((time + (timeDelta * (1 - percents)) < timeNow) && (time + (timeDelta * 0.8) > timeNow)) {
//    digitalWrite(switchPin, HIGH);
//  } else {
//    digitalWrite(switchPin, LOW);
//  }
//  delay(20000);
//  digitalWrite(switchPin, HIGH);
//  delay(20000);
//  digitalWrite(switchPin, LOW);
}

double microsToSec(unsigned long value) {
  return value / MICROS_IN_SECONDS;
}

void updateFrequency() {
  unsigned long oldTime = time;
  ++freqCounter;
  time = micros();
  timeDelta = time - oldTime;
}

