"use strict";

var _logger = _interopRequireDefault(require("./logger"));

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _co2Sensor = require("./sensors/co2Sensor");

var _ventController = require("./controllers/ventController");

var _tempSensor = require("./sensors/tempSensor");

var _telegramController = require("./controllers/telegramController");

var _events = require("./controllers/events");

var _sunriseSensor = require("./sensors/sunriseSensor");

var _flowerLightController = require("./controllers/flowerLightController");

var _app = _interopRequireDefault(require("./web/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Control {
  constructor(logger) {
    _defineProperty(this, "context", {});

    _defineProperty(this, "runHandlersByTime", handlerName => {
      const {
        sensors,
        controllers
      } = this.context;

      for (const type of [sensors, controllers]) {
        for (const wtf in type) {
          // Надо придумать нормальный нейминг
          const handler = type[wtf][`handle_${handlerName}`];
          if (!handler) continue;
          this.logger.trace({
            wtf
          }, `Try run ${`handle_${handlerName}`}`);
          handler();
        }
      }
    });

    this.logger = logger;
    this.context = {
      logger,
      sensors: {},
      controllers: {}
    };
    new _events.Events(this.context); // Должен быть запущен первым

    new _telegramController.Telegram(this.context);
    new _ventController.Vent(this.context);
    new _flowerLightController.FlowerLightController(this.context);
    new _co2Sensor.Co2Room(this.context);
    new _tempSensor.Temp(this.context);
    new _sunriseSensor.Sunrise(this.context);
    (0, _app.default)(this.context);

    _nodeCron.default.schedule('* * * * * *', () => {
      this.runHandlersByTime('Second');
    });

    _nodeCron.default.schedule('*/20 * * * * *', () => {
      this.runHandlersByTime('20_Second');
    });

    _nodeCron.default.schedule('* * * * *', () => {
      this.runHandlersByTime('Minute');
    });

    _nodeCron.default.schedule('*/30 * * * *', () => {
      this.runHandlersByTime('Half_hour');
    });

    _nodeCron.default.schedule('0 * * * *', () => {
      this.runHandlersByTime('Hour');
    });
  }

}

new Control(_logger.default);