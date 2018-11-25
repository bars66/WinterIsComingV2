import logger from './logger'
import cron from 'node-cron'

import { Co2Room } from './sensors/co2Sensor'

import { Vent } from './controllers/ventController'
import { Temp } from './sensors/tempSensor'
import { Telegram } from './controllers/telegramController'
import { Events } from './controllers/events'

class Control {
  context = {};

  constructor (logger) {
    this.logger = logger

    this.context = {
      logger,
      sensors: {},
      controllers: {}
    }

    new Events(this.context) // Должен быть запущен первым
    new Telegram(this.context)
    new Vent(this.context)

    new Co2Room(this.context)
    new Temp(this.context)

    cron.schedule('* * * * * *', () => {
      this.runHandlersByTime('Second')
    })

    cron.schedule('*/20 * * * * *', () => {
      this.runHandlersByTime('20_Second')
    })

    cron.schedule('* * * * *', () => {
      this.runHandlersByTime('Minute')
    })

    cron.schedule('*/30 * * * *', () => {
      this.runHandlersByTime('Half_hour')
    })

    cron.schedule('0 * * * *', () => {
      this.runHandlersByTime('Hour')
    })
  }

  runHandlersByTime = (handlerName) => {
    const { sensors, controllers } = this.context

    for (const type of [sensors, controllers]) {
      for (const wtf in type) { // Надо придумать нормальный нейминг
        this.logger.trace({ wtf }, `Try run ${`handle_${handlerName}`}`)

        const handler = wtf[`handle_${handlerName}`]

        if (!handler) return
        handler()
      }
    }
  }
}

new Control(logger)
