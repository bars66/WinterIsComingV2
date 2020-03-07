"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Telegram = void 0;

var _nodeTelegramBotApi = _interopRequireDefault(require("node-telegram-bot-api"));

var _debounce = _interopRequireDefault(require("debounce"));

var _fs = _interopRequireDefault(require("fs"));

var _path2 = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Telegram {
  constructor(context) {
    _defineProperty(this, "watch", () => {
      this.bot.onText(/status/, this.cmd_status);
      this.bot.onText(/setTemp (.+)/, this.cmd_setTemp);
      this.bot.onText(/eval (.+)/, this.cmd_eval);
      this.bot.onText(/flower (.+)/, this.cmd_flowerStatus);
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

    _defineProperty(this, "cmd_flowerStatus", (msg, match) => {
      this.logMessage(msg);
      const chatId = msg.chat.id;
      let text = match && match[1] || '';

      if (text.length) {
        text = text[0].toUpperCase() + text.slice(1, text.length);
        if (text[text.length - 1] !== '.') text += '.';
      }

      const _path = _path2.default.resolve(__dirname, '../../src/cli/text.txt');

      _fs.default.writeFileSync(_path, text);

      this.bot.sendMessage(chatId, JSON.stringify({
        success: true,
        text: text
      }, null, 2));
    });

    _defineProperty(this, "cmd_setTemp", (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match[1];
      this.context.controllers.Vent.setTemp(resp).catch(error => {});
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

        const result = await run.bind(this)();
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

    _defineProperty(this, "sendBroadcastMessage", async msg => {
      try {
        for (const id of this.notificationsIds) {
          await this.bot.sendMessage(id, msg);
        }
      } catch (e) {
        this.logger.error(e, 'broadcast send error');
      }
    });

    _defineProperty(this, "debouncedBroadcastSend", (0, _debounce.default)(this.sendBroadcastMessage, 5000));

    // this.control = context
    this.context = context;
    this.logger = context.logger;
    this.bot = new _nodeTelegramBotApi.default(process.env.TG_BOT, {
      polling: true
    });
    this.notificationsIds = process.env.TG_IDS.split(',');
    this.watch();
    this.context.controllers.Telegram = this;
    this.logger.debug('controllers/Telegram started');
  }

}

exports.Telegram = Telegram;