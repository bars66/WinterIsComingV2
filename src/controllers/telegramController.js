import TelegramBot from 'node-telegram-bot-api'

export class TelegramController {
  constructor (control) {
    this.control = control
    this.logger = control.logger
    this.bot = new TelegramBot(process.env.TG_BOT, { polling: true })

    this.watch()
  }

  watch = () => {
    this.bot.onText(/status/, this.cmd_status);

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

    const cnt = {
      ...this.control,
      tgBot: undefined
    }

    this.bot.sendMessage(chatId, JSON.stringify(cnt, null, 2))
  }


}
