import SerialPort from 'serialport'
import EventEmitter from 'events'
require('dotenv').config()

const VENT_SERIAL_PORT = process.env.VENT_SERIAL_PORT

export class VentController extends EventEmitter {
  static instance;
  connected = false;
  params = {
    temp: +24.5,
    ventEnabled: false,
    heaterEnabled: false
  };
  lastChanged = new Date(0);

  constructor (logger) {
    super()
    this.logger = logger
    const port = new SerialPort(VENT_SERIAL_PORT, {
      baudRate: 38400
    })

    this.port = port
    port.on('open', () => {
      this.connected = true
      this.subscribe()
    })
  }

  static getSingletone = (logger) => {
    if (!VentController.instance) {
      VentController.instance = new VentController(logger)
    }

    return VentController.instance
  };

  checkPort = () => {
    if (!this.connected) throw new Error('Not connected to vent controller')
    this.lastChanged = new Date()
  }

  setManual = (manual) => {
    this.manualControl = manual
  }

  disable = (force = true) => {
    this.checkPort()
    this.manualControl = force
    this.port.write(`00 ${this.params.temp}`)
    this.params = {
      ...this.params,
      ventEnabled: false,
      heaterEnabled: false
    }
  }

  enable = (force = true) => {
    if (!force && this.manualControl) return
    this.checkPort()
    this.port.write(`11 ${this.params.temp}`)
    this.params = {
      ...this.params,
      ventEnabled: true,
      heaterEnabled: true
    }
  }

  setTemp = (temp) => {
    this.checkPort()
    const { ventEnabled, heaterEnabled } = this.params
    const tempLength = `${temp}`
    this.port.write(`${ventEnabled}${heaterEnabled} ${temp}${tempLength === 2 ? '.0' : ''}`)
    this.params = {
      ...this.params,
      temp
    }
  }

  subscribe = () => {
    this.port.on('data', function (dataBuffer) {
      const dataString = dataBuffer.toString('utf8')
      const [type, data] = dataString.split('=')

      if (type === 'I') {
        const [canaltTmp, insideTmp, timeDelta, heaterPowerAvg, ventEnabled, heaterEnabled, temp] = data.split(';')
        const frequency = (1 / timeDelta) * 1000000
        const heaterPower = +heaterPowerAvg / 5
        const heaterWatts = heaterPower * 240

        this.params = {
          msgType: type,
          canaltTmp: +canaltTmp,
          insideTmp: +insideTmp,
          timeDelta,
          heaterPower: +heaterPower,
          ventEnabled: Boolean(ventEnabled),
          heaterEnabled: Boolean(heaterEnabled),
          temp: +temp,
          frequency: +frequency / 2,
          heaterWatts
        }
        this.emit('values', this.params)

        this.logger.info(this.params)
        return
      }

      this.logger.info({
        msgType: type,
        data
      })
    })
  }
}
