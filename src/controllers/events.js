import EventEmitter from 'events'

export class Events extends EventEmitter {
  constructor (context) {
    super()
    this.context = context
    this.logger = context.logger
    this.context.controllers.Events = this
    this.logger.debug('controllers/Events started')
  }

  send = (name, ...values) => {
    this.logger.trace({
      name,
      values
    }, 'Event emit')

    this.emit(name, ...values)
  }
}
