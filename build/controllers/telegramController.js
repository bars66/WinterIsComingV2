"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelegramController = void 0;

var _nodeTelegramBotApi = _interopRequireDefault(require("node-telegram-bot-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TelegramController {
  constructor(control) {
    _defineProperty(this, "watch", () => {
      this.bot.onText(/status/, this.cmd_status);
      this.bot.bot.on('polling_error', error => {
        this.logger.error(error);
      });
    });

    _defineProperty(this, "logMessage", msg => {
      this.logger.info(msg, 'Bot receive message');
    });

    _defineProperty(this, "cmd_status", (msg, match) => {
      this.logMessage(msg);
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, JSON.stringify(this.control, null, 2));
    });

    this.control = control;
    this.logger = control.logger;
    this.bot = new _nodeTelegramBotApi.default(process.env.TG_BOT, {
      polling: true
    });
    this.watch();
  }

}

exports.TelegramController = TelegramController;