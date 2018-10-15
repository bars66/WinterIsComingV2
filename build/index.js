"use strict";

var _logger2 = _interopRequireDefault(require("./logger"));

var _co2Sensor = require("./sensors/co2Sensor");

var _ventController = require("./controllers/ventController");

var _tempSensor = require("./sensors/tempSensor");

var _telegramController = require("./controllers/telegramController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Control {
  constructor(_logger) {
    _defineProperty(this, "CO2_MAX_TRESHOLD", 900);

    _defineProperty(this, "CO2_MIN_TRESHOLD", 500);

    _defineProperty(this, "TMP_TRESHOLD", 1.5);

    _defineProperty(this, "ventByCo2AndTemp", () => {
      const co2Value = this.sensors.co2.value;
      const insideTmpValue = this.sensors.temp.value.insideTmp;
      const ventController = this.controllers.vent;
      const ventControllerTemp = this.controllers.vent.params.temp;

      if (ventControllerTemp - insideTmpValue > this.TMP_TRESHOLD) {
        _logger2.default.info({
          msgType: 'ventByCo2AndTemp'
        }, 'Enable by temp treshold');

        ventController.enable();
        return;
      }

      if (co2Value > this.CO2_MAX_TRESHOLD) {
        _logger2.default.info({
          msgType: 'ventByCo2AndTemp'
        }, 'Enable by CO2 treshold');

        ventController.enable();
      }

      if (co2Value < this.CO2_MIN_TRESHOLD) {
        _logger2.default.info({
          msgType: 'ventByCo2AndTemp'
        }, 'Disable by CO2 treshold');

        ventController.disable();
      }
    });

    _defineProperty(this, "handle", () => {
      this.ventByCo2AndTemp();
    });

    this.logger = _logger;
    this.sensors = {
      co2: _co2Sensor.Co2Sensor.getSingletone(_logger),
      temp: _tempSensor.TempSensor.getSingletone(_logger)
    };
    this.controllers = {
      vent: _ventController.VentController.getSingletone(_logger)
    };
    setTimeout(() => {
      this.handle();
    }, 20 * 1000);
    this.tgBot = new _telegramController.TelegramController(this);
  }

}

new Control(_logger2.default); // bot.onText(/disabled/, (msg, match) => {
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