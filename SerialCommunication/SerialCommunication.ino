// ****************************************************
// ***** LSU DDEM Pathway:                            *
// ***** Programming Digital Media                    *
// Jesse Allison & Anthony T. Marasco                 *
// PDM - Serial Communication between P5 and Arduino  *
//https://youtu.be/exFDhKGN7AQ
#include "PDMSerial.h"

PDMSerial pdm;

const int analogPin = A0;
const int digitalInPin = 7;

const int spawnLED = 2;
const int speedLED = 3;

/////////
int buttonState = LOW;

int sensorValue = 0;
int sensorTransmitValue = 0;
///////////


void setup() {
  pinMode(analogPin, INPUT);
  pinMode(digitalInPin, INPUT);

  pinMode(spawnLED, OUTPUT);
  pinMode(speedLED, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  sensorValue = analogRead(analogPin);
  float sensorFloatValue = sensorValue/1023.0;
  
  buttonState = digitalRead(digitalInPin);

  if(sensorValue < 341) {
    analogWrite(speedLED, 1023 / 3);
  }
  else if(sensorValue < 682) {
    analogWrite(speedLED, (2 * 1023) / 3);
  }
  else if(sensorValue < 1023) {
    analogWrite(speedLED, 1023);
  }
  
  pdm.transmitSensor("a0", sensorValue);
  pdm.transmitSensor("float0", sensorFloatValue);
  pdm.transmitSensor("p7", buttonState);
  pdm.transmitSensor("end");

  boolean newData = pdm.checkSerial();
  
  if(newData) {
    if(pdm.getName().equals(String("spawnLED"))) {
      digitalWrite(spawnLED, pdm.getValue());
    } 
  }
}
