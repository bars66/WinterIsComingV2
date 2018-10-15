import logger from './logger'

import { Co2Sensor } from './sensors/co2Sensor'

import { VentController } from './controllers/ventController'
import { TempSensor } from './sensors/tempSensor'
import { TelegramController } from './controllers/telegramController'

class Control {
  CO2_MAX_TRESHOLD = 600;
  CO2_MIN_TRESHOLD = 490;
  TMP_TRESHOLD = 1;

  constructor (logger) {
    this.logger = logger
    this.sensors = {
      co2: Co2Sensor.getSingletone(logger),
      temp: TempSensor.getSingletone(logger)
    }

    this.controllers = {
      vent: VentController.getSingletone(logger)
    }

    setInterval(() => {
      this.handle()
    }, 20 * 1000)

    this.tgBot = new TelegramController(this)
  }

  ventByCo2AndTemp = () => {
    const co2Value = this.sensors.co2.value.value
    const insideTmpValue = this.sensors.temp.value.inside
    const ventController = this.controllers.vent
    const ventControllerTemp = this.controllers.vent.params.temp
    logger.debug({
      co2Value,
      insideTmpValue,
      ventControllerTemp
    }, 'ventByCo2AndTemp')
    if (ventControllerTemp - insideTmpValue > this.TMP_TRESHOLD) {
      logger.info({ msgType: 'ventByCo2AndTemp' }, 'Enable by temp treshold')
      ventController.enable()
      return
    }

    if (co2Value > this.CO2_MAX_TRESHOLD) {
      logger.info({ msgType: 'ventByCo2AndTemp' }, 'Enable by CO2 treshold')
      ventController.enable()
    }

    if (co2Value < this.CO2_MIN_TRESHOLD) {
      logger.info({ msgType: 'ventByCo2AndTemp' }, 'Disable by CO2 treshold')
      ventController.disable()
    }
  }

  handle = () => {
    this.ventByCo2AndTemp()
  }
}

new Control(logger)
