import SerialPort from 'serialport'
import EventEmitter from 'events'
import logger from '../logger'
require('dotenv').config()

const VENT_SERIAL_PORT = process.env.VENT_SERIAL_PORT

export class Vent {
  CO2_MAX_TRESHOLD = 600;
  CO2_MIN_TRESHOLD = 490;
  TMP_TRESHOLD = 1;
  name = 'controllers/Vent';

  connected = false;
  params = {
    temp: +24.5,
    ventEnabled: false,
    heaterEnabled: false
  };
  lastChanged = new Date(0);

  constructor (context) {
    this.logger = logger
    this.context = context
    const port = new SerialPort(VENT_SERIAL_PORT, {
      baudRate: 38400
    })

    this.port = port
    port.on('open', () => {
      this.connected = true
      this.subscribe()
    })

    this.context.controllers.Vent = this
    this.logger.debug('controllers/Vent started')
  }

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
    const sendStr = `${+ventEnabled}${+heaterEnabled} ${temp}${tempLength === 2 ? '.0' : ''}`
    this.logger.debug(`SEND::: ${sendStr}`)
    this.port.write(sendStr)
    this.params = {
      ...this.params,
      temp
    }
  }

  subscribe = () => {
    this.port.on('data', (dataBuffer) => {
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
        this.context.controllers.Events.send('temperatureFromVent', this.params)

        this.logger.info(this.params)
      } else {
        this.logger.info({
          msgType: type,
          data
        })
      }
    })
  }

  handle_20_Second = () => {
    this.logger.debug({ name }, 'Start 20 second handler')
    this.ventByCo2AndTemp()
  }

  ventByCo2AndTemp = () => {
    const { Co2Room, Temp } = this.context.sensors

    const co2Value = Co2Room.value.value
    const insideTmpValue = Temp.value.inside
    const ventControllerTemp = this.params.temp

    logger.debug({
      co2Value,
      insideTmpValue,
      ventControllerTemp
    }, 'ventByCo2AndTemp')

    this.logger.trace({
      tempDelta: ventControllerTemp - insideTmpValue,
      tmpTreshold: this.TMP_TRESHOLD,
      co2MaxTreshold: this.CO2_MAX_TRESHOLD,
      co2MinTreshold: this.CO2_MIN_TRESHOLD
    }, 'ventByCo2AndTemp')

    if (ventControllerTemp - insideTmpValue > this.TMP_TRESHOLD) {
      logger.info({ msgType: 'ventByCo2AndTemp' }, 'Enable by temp treshold')
      this.enable()
      return
    }

    if (co2Value > this.CO2_MAX_TRESHOLD) {
      logger.info({ msgType: 'ventByCo2AndTemp' }, 'Enable by CO2 treshold')
      this.enable()
    }

    if (co2Value < this.CO2_MIN_TRESHOLD) {
      logger.info({ msgType: 'ventByCo2AndTemp' }, 'Disable by CO2 treshold')
      this.disable()
    }
  }
}
