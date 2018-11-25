"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Telegram = void 0;

var _nodeTelegramBotApi = _interopRequireDefault(require("node-telegram-bot-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Telegram {
  constructor(context) {
    _defineProperty(this, "watch", () => {
      this.bot.onText(/status/, this.cmd_status);
      this.bot.onText(/iamadmin (.+)/, this.cmd_setTemp);
      this.bot.onText(/eval (.+)/, this.cmd_eval);
      this.bot.on('polling_error', error => {
        this.logger.error(error);
      });
    });

    _defineProperty(this, "logMessage", msg => {
      this.logger.info(msg, 'Bot receive message');
    });

    _defineProperty(this, "cmd_status", (msg, match) => {
      this.logMessage(msg);
      const chatId = msg.chat.id;
      const sensors = {};
      const controllers = {};
      const {
        sensors: sensorsControl,
        controllers: controllersControl
      } = this.context;

      for (const key in sensorsControl) {
        sensors[key] = sensorsControl[key].getValues();
      }

      for (const key in controllersControl) {
        controllers[key] = controllersControl[key].params;
      }

      this.bot.sendMessage(chatId, JSON.stringify({
        sensors,
        controllers
      }, null, 2));
    });

    _defineProperty(this, "cmd_setTemp", (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match[1];
      this.context.controllers.Vent.setTemp(resp);
      this.bot.sendMessage(chatId, `SEND 11 ${resp}`);
      setTimeout(() => {
        this.cmd_status(msg, match);
      }, 10 * 1000);
    });

    _defineProperty(this, "cmd_eval", async (msg, match) => {
      const chatId = msg.chat.id;

      try {
        const code = match[1];
        let run;
        eval(code);

        if (!run) {
          this.bot.sendMessage(chatId, `function not found`);
          return;
        }

        const result = run().bind(this);
        this.bot.sendMessage(chatId, JSON.stringify(result, null, 2));
      } catch (e) {
        console.log('ERROR', e);
        this.bot.sendMessage(chatId, `error`);
        this.logger.info({
          error: e,
          stackTrace: e.stackTrace
        }, 'Error in tg eval');
      }
    });

    // this.control = context
    this.context = context;
    this.logger = context.logger;
    this.bot = new _nodeTelegramBotApi.default(process.env.TG_BOT, {
      polling: true
    });
    this.watch();
    this.context.controllers.Telegram = this;
    this.logger.debug('controllers/Telegram started');
  }

}

exports.Telegram = Telegram;