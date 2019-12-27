#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Ticker.h>

#include "env.h"

ESP8266WebServer server(8080);


Ticker timer;

volatile int interrupts;
volatile int isEnabled = 0;


int PWM1 = 0;
int PWM2 = 0;
unsigned long timeS = 0;
volatile char stage = 0;

int getPwmValue(int pwm, char isHigh) {
  if (pwm > 1000) pwm = 1000;
  if (pwm < 0) pwm = 0;

  int timerValue = pwm * 10;
  if (isHigh) {
    // Заполнение
    return 10000 - timerValue < 50 ? 9950 : timerValue; 
  } else {
    // Отключение
    timerValue = 10000 - timerValue;
    return timerValue < 50 ? 50 : timerValue; 
  }
}

// ISR to Fire when Timer is triggered
void ICACHE_RAM_ATTR onTime() {
  interrupts++;

  // Serial.println(interrupts);
  // digitalWrite(12, LOW);
  // delay(1);
  int pwmValue;

  switch (interrupts % 4) {
      case 0:
        pwmValue = getPwmValue(PWM1, 1);
        if (pwmValue == 0) {
          digitalWrite(14, LOW);
          timer1_write(50);
        } else {
          digitalWrite(14, HIGH);
          timer1_write(pwmValue);
        }
        break;
      case 1:
        digitalWrite(14, LOW);
        timer1_write(getPwmValue(PWM1, 0));
        break;
      case 2:
        pwmValue = getPwmValue(PWM2, 1);
        if (pwmValue == 0) {
          digitalWrite(4, LOW);
          timer1_write(50);
        } else {
          digitalWrite(4, HIGH);
          timer1_write(pwmValue);
        }
        
        break;
      case 3:
        digitalWrite(4, LOW);
        timer1_write(getPwmValue(PWM2, 0));
        break;              
  }
  // delay(1);
// timer1_write(5000);

}

void setup()
{
  Serial.begin(115200);
  Serial.println();

  WiFi.begin(WIFI_NAME, WIFI_PASSWORD);
  WiFi.mode(WIFI_STA);

  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
  server.on("/", HTTP_GET, []() {
    String _PWM1 = server.arg("PWM1");
    PWM1 = _PWM1.toInt();
    String _PWM2 = server.arg("PWM2");
    PWM2 = _PWM2.toInt();
    String _time = server.arg("time");
    timeS = _time.toInt();
    stage = 0;
    server.send(200, "text/plain", "OK" + _PWM1 + _PWM2 + "END2");

  });

  server.on("/api/enable", HTTP_GET, []() {
    server.send(200, "text/plain", "OK");
  });

  server.on("/api/disable", HTTP_GET, []() {
    server.send(200, "text/plain", "OK");
  });


  server.on("/update", HTTP_POST, []() {
    server.sendHeader("Connection", "close");
    server.send(200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
    ESP.restart();
  }, []() {
    HTTPUpload& upload = server.upload();
    if (upload.status == UPLOAD_FILE_START) {
      timer1_detachInterrupt();
      digitalWrite(4, LOW);
      digitalWrite(14, LOW);
      digitalWrite(12, LOW);

      Serial.setDebugOutput(true);
      WiFiUDP::stopAll();
      Serial.printf("Update: %s\n", upload.filename.c_str());
      uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000;
      if (!Update.begin(maxSketchSpace)) { //start with max available size
        Update.printError(Serial);
      }
    } else if (upload.status == UPLOAD_FILE_WRITE) {
      if (Update.write(upload.buf, upload.currentSize) != upload.currentSize) {
        Update.printError(Serial);
      }
    } else if (upload.status == UPLOAD_FILE_END) {
      if (Update.end(true)) { //true to set the size to the current progress
        Serial.printf("Update Success: %u\nRebooting...\n", upload.totalSize);
      } else {
        Update.printError(Serial);
      }
      Serial.setDebugOutput(false);
    }
    yield();
  });
  server.begin();
  pinMode(4, OUTPUT);
  pinMode(14, OUTPUT);
  pinMode(12, OUTPUT);

  //   //Initialize Ticker every 0.5s
  timer1_attachInterrupt(onTime); // Add ISR Function
  timer1_enable(TIM_DIV16, TIM_EDGE, TIM_SINGLE);
  // // /* Dividers:
  // //   TIM_DIV1 = 0,   //80MHz (80 ticks/us - 104857.588 us max)
  // //   TIM_DIV16 = 1,  //5MHz (5 ticks/us - 1677721.4 us max)
  // //   TIM_DIV256 = 3  //312.5Khz (1 tick = 3.2us - 26843542.4 us max)
  // // Reloads:
  // //   TIM_SINGLE  0 //on interrupt routine you need to write a new value to start the timer again
  // //   TIM_LOOP  1 //on interrupt the counter will start with the same value again
  // // */
  
  // // // Arm the Timer for our 0.5s Interval
  timer1_write(200); // 2500000 / 5 ticks per us from TIM_DIV16 == 500,000 us interval 
  digitalWrite(12, HIGH);
  // digitalWrite(4, LOW);

  Serial.print("Init done.");
}


void loop(void) {
  server.handleClient();
  if (!!timeS && millis() % timeS == 0) {
    switch (stage) {
      case 0:
        --PWM1;
        if (PWM1 == 1) stage = 1;
        break;
      case 1:
        ++PWM2;
        if (PWM2 == 999) stage = 2;
        break;
      case 2:
        --PWM2;
        if (PWM2 == 1) stage = 3;
        break;
      case 3:
        ++PWM1;
        if (PWM1 == 999) stage = 0;
        break;               
    }

  }
  // digitalWrite(14, HIGH);
    // digitalWrite(12, HIGH);

  // digitalWrite(4, HIGH);

}