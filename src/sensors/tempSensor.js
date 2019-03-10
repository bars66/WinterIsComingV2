import { AbstractSensor } from './abstractSensor'

export class Temp extends AbstractSensor {
  value = {};
  constructor (context) {
    super()
    this.context = context
    this.logger = context.logger

    this.subscribe()

    this.context.sensors.Temp = this
    this.logger.debug('sensors/Temp started')
  }

  subscribe = () => {
    this.context.controllers.Events.on('temperatureFromVent', ({ canaltTmp, insideTmp }) => {
      this.value = {
        canal: canaltTmp,
        inside: insideTmp,
        lastUpdate: new Date(),
      }
    })
  }
}
