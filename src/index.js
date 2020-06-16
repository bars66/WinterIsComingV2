import logger from './logger.ts'
import cron from 'node-cron'

import { Co2Room } from './sensors/co2Sensor'

import { Vent } from './controllers/ventController'
import { Temp } from './sensors/tempSensor'
import { Telegram } from './controllers/telegramController'
import {Camera} from './controllers/cameraController'
import { Events } from './controllers/events'
import { Sunrise } from './sensors/sunriseSensor'
import { FlowerLightController } from './controllers/flowerLightController'
import {GrlndNyController} from './controllers/grlnNyController'
import {ScheduleController} from './controllers/scheduleController';
import WebApp from './web/app'

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
    new FlowerLightController(this.context)
    new GrlndNyController(this.context);
    new Camera(this.context)
    new ScheduleController(this.context);

    new Co2Room(this.context)
    new Temp(this.context)
    new Sunrise(this.context)

    WebApp(this.context)

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
        const handler = type[wtf][`handle_${handlerName}`]

        if (!handler) continue
        this.logger.trace({ wtf }, `Try run ${`handle_${handlerName}`}`)
        handler()
      }
    }
  }
}

new Control(logger)
