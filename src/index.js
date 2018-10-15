import logger from './logger'

import { Co2Sensor } from './sensors/co2Sensor'

import { VentController } from './controllers/ventController'
import { TempSensor } from './sensors/tempSensor'
import { TelegramController } from './controllers/telegramController'

class Control {
  CO2_MAX_TRESHOLD = 900;
  CO2_MIN_TRESHOLD = 500;
  TMP_TRESHOLD = 1.5;

  constructor (logger) {
    this.logger = logger
    this.sensors = {
      co2: Co2Sensor.getSingletone(logger),
      temp: TempSensor.getSingletone(logger)
    }

    this.controllers = {
      vent: VentController.getSingletone(logger)
    }

    setTimeout(() => {
      this.handle()
    }, 20 * 1000)

    this.tgBot = new TelegramController(this)
  }

  ventByCo2AndTemp = () => {
    const co2Value = this.sensors.co2.value
    const insideTmpValue = this.sensors.temp.value.insideTmp
    const ventController = this.controllers.vent
    const ventControllerTemp = this.controllers.vent.params.temp

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

// bot.onText(/disabled/, (msg, match) => {
//   port.write('00 24.5')
//   const chatId = msg.chat.id
//   tgLastUserInfo = msg
//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, 'DISABLED')
//   setTimeout(() => {
//     bot.sendMessage(chatId, JSON.stringify(iObj, null, 2))
//   }, 10 * 1000)
// })
//
// bot.onText(/enabled/, (msg, match) => {
//   port.write('11 24.5')
//   const chatId = msg.chat.id
//   tgLastUserInfo = msg
//
//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, 'ENABLED')
//   setTimeout(() => {
//     bot.sendMessage(chatId, JSON.stringify(iObj, null, 2))
//   }, 10 * 1000)
// })
//
// bot.onText(/status/, (msg, match) => {
//   const chatId = msg.chat.id
//   tgLastUserInfo = msg
//
//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, JSON.stringify(iObj, null, 2))
// })
//
// bot.onText(/iamadmin (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message
//   tgLastUserInfo = msg
//
//   const chatId = msg.chat.id
//   const resp = match[1]
//   port.write(resp)
//
//   // send back the matched "whatever" to the chat
//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, `SEND ${resp}`)
//   setTimeout(() => {
//     bot.sendMessage(chatId, JSON.stringify(iObj, null, 2))
//   }, 10 * 1000)
// })
//

//
// bot.onText(/log/, (msg, match) => {
//   const chatId = msg.chat.id
//
//   bot.sendMessage(chatId, JSON.stringify(tgLastUserInfo, null, 2))
// })
