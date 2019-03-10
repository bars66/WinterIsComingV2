import { AbstractSensor } from './abstractSensor'

require('dotenv').config()
const PORT = '/dev/ttyS2'
const DEBUG = process.env.DEBUG
const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

export class Co2Room extends AbstractSensor {
  value = {};
  constructor (context) {
    super()
    this.context = context
    this.logger = context.logger
    const logger = this.logger

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

      this.value = {
        value: 1900
      }

      logger.debug('Create mocked serialport')
    }

    this.context.sensors.Co2Room = this
    this.logger.debug('sensors/Co2Room started')
  }
}
