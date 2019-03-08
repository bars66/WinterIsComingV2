#include <OneWire.h>
#include <DallasTemperature.h>
#include <SoftTimer.h>



unsigned long time = 0;
unsigned long freqCounter = 0;
long timeDeltaSumm = 0;
unsigned long timeDelta = 0;
long value = 0;
long heaterPower = 0;
long heaterPowerAvg = 0;
int heaterPowerAvgCount = 0;

float canalTmp = 40;
float insideTmp = 0;
bool heaterEnabled = false;
bool ventEnabled = false;

const double MICROS_IN_SECONDS = 1000000.0;

float tmp = 23.5;

// pins
#define FREQUENCY_SENSOR_PIN 2
#define FAN_PIN 4
#define HEATER_PIN 5

// Thermometers
#define ONE_WIRE_BUS 10
#define TEMPERATURE_PRECISION 9
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DeviceAddress insideThermometer;
DeviceAddress canalThermometer;

// Heaters coefficents
#define MAX_HEATER_POWER 9
#define TMP_DELTA 1
#define MAX_CANAL_TEMP 50
const int K = 5;

void getIndoorTemp(Task* me);
void getCanalTemp(Task* me);
void getHeaterPowerValue(Task* me);
void printSerial(Task* me);
void readSerial(Task* me);

// timers
Task GetHeaterPowerValue(950, getHeaterPowerValue);
Task GetCanalTemp(900, getCanalTemp);
Task GetIndoorTemp(30000, getIndoorTemp);
Task PrintSerial(1000, printSerial);
Task ReadSerial(300, readSerial);

void initPins() {
  pinMode(FREQUENCY_SENSOR_PIN, INPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(HEATER_PIN, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(FREQUENCY_SENSOR_PIN), updateFrequency, FALLING);
}

void initTempSensors() {
  sensors.begin();
  sensors.getAddress(canalThermometer, 0);
  sensors.getAddress(insideThermometer, 1);
  sensors.setResolution(canalThermometer, TEMPERATURE_PRECISION);
  sensors.setResolution(insideThermometer, TEMPERATURE_PRECISION); 
}

void setup() {
  Serial.begin(38400);
  Serial.println("I=NAME:HEATER_CONTROL;V:2.0");
  initPins();
  initTempSensors();

  Serial.println("I=INIT;");

  SoftTimer.add(&GetCanalTemp);
  SoftTimer.add(&GetHeaterPowerValue);
  SoftTimer.add(&GetIndoorTemp);
  SoftTimer.add(&PrintSerial);
  SoftTimer.add(&ReadSerial);
}

void serialFlush() {
  while(Serial.available() > 0) {
    char t = Serial.read();
  }
}

void readSerial(Task* me) {
  if (!Serial.available()) return;

  String inputString = "";

  while (Serial.available()) {
    char inputChar = (char)Serial.read();
    if (inputChar == '\n' || inputChar == '\r') {
      serialFlush();
      break;
    }

    inputString += inputChar;
  }
  Serial.print("OUTPUT=");
  Serial.println(inputString);

  // TODO В отдельнуб функцию
  if (inputString.length() != 7) {
    Serial.print("F=INCRORRECT_INPUT;V:");
    Serial.println(inputString);
    return;
  }

  ventEnabled = int(inputString[0]) == 49;
  heaterEnabled = int(inputString[1]) == 49;

  if (!ventEnabled) {
    heaterEnabled = false;
  }

  String tempAsStr = inputString.substring(3);

  float newTmp = tempAsStr.toFloat();
  if (tmp > 40 || tmp < 0) {
    Serial.print("F=INCORRECT_INPUT_TEMP;V:");
    Serial.print(tempAsStr);
    Serial.print(";PARSED:");
    Serial.println(newTmp);
    return;
  } else {
    tmp = newTmp;
    printInfo();
  }
}

void getIndoorTemp(Task* me) {
  sensors.requestTemperaturesByAddress(insideThermometer);
  insideTmp = sensors.getTempC(insideThermometer);
}

void getCanalTemp(Task* me) {
  sensors.requestTemperaturesByAddress(canalThermometer);
  canalTmp = sensors.getTempC(canalThermometer);
}

void getHeaterPowerValue(Task* me) {
  heaterPowerAvgCount++;
  // Serial.println("D=RUN_HEATER");

  if (!heaterEnabled) {
    heaterPower = 0;
    // Serial.println("D=HEATER_DISABLED-RETURN");

    return;
  }

  float value = K * max(tmp - insideTmp, 10.0 - canalTmp);
  // Serial.print("D=VALUE_RAW");
  // Serial.println(value);

  if (value < 0) {
    value = 0;
  } else {
    if (value > MAX_HEATER_POWER) {
      value = MAX_HEATER_POWER;
    }
  }

  heaterPower = value;
  // Serial.print("D=VALUE:");
  // Serial.println(heaterPower);
  heaterPowerAvg += value;
  heaterPowerAvgCount++;
}

void printInfo() {
  Serial.print("I=");
  Serial.print(canalTmp);
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
  Serial.print(";");
  Serial.print(heaterPowerAvgCount);
  Serial.println("");
}

void printSerial(Task* me) {
  if (insideTmp < -50 || canalTmp < -50) {
    Serial.print("F=");
    Serial.println("TEMP_RANGE_ERROR: < -50");
  }

  if (canalTmp >= MAX_CANAL_TEMP) {
    Serial.print("F=");
    Serial.println("MAX_CANAL_TEMP");
  }
  
  printInfo();

  heaterPowerAvg = 0;
  heaterPowerAvgCount = 0;
}



void updateFrequency() {
  unsigned long oldTime = time;
  ++freqCounter;
  time = micros();
  timeDelta = time - oldTime;

  if (insideTmp < -50 || canalTmp < -50) {
    heaterEnabled = false; 
  }

  if (tmp > 35 || tmp < 10) {
    digitalWrite(HEATER_PIN, LOW);
    digitalWrite(FAN_PIN, LOW);

    ventEnabled = false;
    heaterEnabled = false;
  }

  if (ventEnabled || heaterEnabled || canalTmp > 25) {
    digitalWrite(FAN_PIN, HIGH);
  } else {
    digitalWrite(FAN_PIN, LOW);
  }

  if (heaterEnabled && ventEnabled && heaterPower && freqCounter % 10 <= heaterPower && canalTmp < MAX_CANAL_TEMP) {
    digitalWrite(HEATER_PIN, HIGH);
  } else {
    digitalWrite(HEATER_PIN, LOW);
  }
}

