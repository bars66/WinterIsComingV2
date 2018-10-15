require('dotenv').config()
const PORT = '/dev/ttyS2'
const DEBUG = process.env.DEBUG
const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

import {AbstractSensor} from './abstractSensor';

export class Co2Sensor extends AbstractSensor {
  value = {};
  constructor (logger) {
    super();

    this.cmd = new Buffer([0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79])
    if (!DEBUG) {
      this.port = new SerialPort(PORT, {
        baudRate: 9600,
        dataBits: 8,
        parity: 'none'
      })

      this.port.on('data', (b) => {
        const cs = (255 - (b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7]) % 256) + 1
        if (cs !== b[8]) {
          logger.info('CO2 incorrect control summ')

          return
        }

        this.value = {
          value: 256 * b[2] + b[3],
          temp: b[4] - 40,
          st: Number(b[5]),
          u: 256 * b[6] + b[7],
          _lastUpdate: new Date()
        }
        logger.info({
          ...this.value,
          msgType: 'CO2_METRIC'
        }, 'CO2 value')
      })

      logger.debug(PORT, 'Connect to CO2 port')
      this.port.write(this.cmd)

      setInterval(() => {
        this.port.write(this.cmd)
      }, 20 * 1000)
    } else {
      this.port = {
        write: (...args) => {
          logger.info(args, 'Write in SerialPort')
        }
      }

      logger.debug('Create mocked serialport')
    }
  }

  static getSingletone = (logger) => {
    if (!Co2Sensor.instance) {
      Co2Sensor.instance = new Co2Sensor(logger)
    }

    return Co2Sensor.instance
  };
}
