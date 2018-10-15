import TelegramBot from 'node-telegram-bot-api'

export class TelegramController {
  constructor (control) {
    this.control = control
    this.logger = control.logger
    this.bot = new TelegramBot(process.env.TG_BOT, { polling: true })

    this.watch()
  }

  watch = () => {
    this.bot.onText(/status/, this.cmd_status)
    this.bot.onText(/iamadmin (.+)/, this.cmd_setTemp);

    this.bot.on('polling_error', (error) => {
      this.logger.error(error)
    })
  }

  logMessage = (msg) => {
    this.logger.info(msg, 'Bot receive message')
  }

  cmd_status = (msg, match) => {
    this.logMessage(msg)

    const chatId = msg.chat.id

    const sensors = {};
    const controllers = {};

    const {sensors: sensorsControl, controllers: controllersControl} = this.control;

    for (const key in sensorsControl) {
      sensors[key] = sensorsControl[key].getValues();
    }

    for (const key in controllersControl) {
      controllers[key] = controllersControl[key].params;
    }

    this.bot.sendMessage(chatId, JSON.stringify({sensors, controllers}, null, 2))
  }

  cmd_setTemp = (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1];

    this.control.controllers.vent.setTemp(resp);

    this.bot.sendMessage(chatId, `SEND 11 ${resp}`)
    setTimeout(() => {
      this.cmd_status(msg, match);
    }, 10 * 1000)
  }
}
