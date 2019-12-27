#!/bin/bash
for i in {0..999}
do
   curl "http://192.168.30.190:8080/?PWM1=$i&PWM2=0"
   sleep 0.1
done