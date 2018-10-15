"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VentController = void 0;

var _serialport = _interopRequireDefault(require("serialport"));

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv').config();

const VENT_SERIAL_PORT = process.env.VENT_SERIAL_PORT;

class VentController extends _events.default {
  constructor(logger) {
    super();

    _defineProperty(this, "connected", false);

    _defineProperty(this, "params", {
      temp: +24.5,
      ventEnabled: false,
      heaterEnabled: false
    });

    _defineProperty(this, "lastChanged", new Date(0));

    _defineProperty(this, "checkPort", () => {
      if (!this.connected) throw new Error('Not connected to vent controller');
      this.lastChanged = new Date();
    });

    _defineProperty(this, "setManual", manual => {
      this.manualControl = manual;
    });

    _defineProperty(this, "disable", (force = true) => {
      this.checkPort();
      this.manualControl = force;
      this.port.write(`00 ${this.params.temp}`);
      this.params = _objectSpread({}, this.params, {
        ventEnabled: false,
        heaterEnabled: false
      });
    });

    _defineProperty(this, "enable", (force = true) => {
      if (!force && this.manualControl) return;
      this.checkPort();
      this.port.write(`11 ${this.params.temp}`);
      this.params = _objectSpread({}, this.params, {
        ventEnabled: true,
        heaterEnabled: true
      });
    });

    _defineProperty(this, "setTemp", temp => {
      this.checkPort();
      const {
        ventEnabled,
        heaterEnabled
      } = this.params;
      const tempLength = `${temp}`;
      this.logger.debug(`SEND::: ${ventEnabled}${heaterEnabled} ${temp}${tempLength === 2 ? '.0' : ''}`);
      this.port.write(`${ventEnabled}${heaterEnabled} ${temp}${tempLength === 2 ? '.0' : ''}`);
      this.params = _objectSpread({}, this.params, {
        temp
      });
    });

    _defineProperty(this, "subscribe", () => {
      this.port.on('data', dataBuffer => {
        const dataString = dataBuffer.toString('utf8');
        const [type, data] = dataString.split('=');

        if (type === 'I') {
          const [canaltTmp, insideTmp, timeDelta, heaterPowerAvg, ventEnabled, heaterEnabled, temp] = data.split(';');
          const frequency = 1 / timeDelta * 1000000;
          const heaterPower = +heaterPowerAvg / 5;
          const heaterWatts = heaterPower * 240;
          this.params = {
            msgType: type,
            canaltTmp: +canaltTmp,
            insideTmp: +insideTmp,
            timeDelta,
            heaterPower: +heaterPower,
            ventEnabled: Boolean(ventEnabled),
            heaterEnabled: Boolean(heaterEnabled),
            temp: +temp,
            frequency: +frequency / 2,
            heaterWatts
          };
          this.emit('values', this.params);
          this.logger.info(this.params);
        } else {
          this.logger.info({
            msgType: type,
            data
          });
        }
      });
    });

    this.logger = logger;
    const port = new _serialport.default(VENT_SERIAL_PORT, {
      baudRate: 38400
    });
    this.port = port;
    port.on('open', () => {
      this.connected = true;
      this.subscribe();
    });
  }

}

exports.VentController = VentController;

_defineProperty(VentController, "instance", void 0);

_defineProperty(VentController, "getSingletone", logger => {
  if (!VentController.instance) {
    VentController.instance = new VentController(logger);
  }

  return VentController.instance;
});