#!/bin/sh
pio run
curl -F "image=@./.pio/build/esp12e/firmware.bin" http://192.168.30.190:8080/update