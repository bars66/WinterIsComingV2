"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vent = void 0;

var _serialport = _interopRequireDefault(require("serialport"));

var _parserReadline = _interopRequireDefault(require("@serialport/parser-readline"));

var _events = _interopRequireDefault(require("events"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv').config();

const VENT_SERIAL_PORT = process.env.VENT_SERIAL_PORT;

class Vent {
  constructor(context) {
    _defineProperty(this, "CO2_MAX_TRESHOLD", 600);

    _defineProperty(this, "CO2_MIN_TRESHOLD", 490);

    _defineProperty(this, "TMP_TRESHOLD", 1);

    _defineProperty(this, "name", 'controllers/Vent');

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
      this.manualControl = force;
      this.params = _objectSpread({}, this.params, {
        ventEnabled: false,
        heaterEnabled: false
      });
      this.setTemp(this.params.temp);
    });

    _defineProperty(this, "enable", (force = true) => {
      if (!force && this.manualControl) return;
      this.checkPort();
      this.params = _objectSpread({}, this.params, {
        ventEnabled: true,
        heaterEnabled: true
      });
      this.setTemp(this.params.temp);
    });

    _defineProperty(this, "setTemp", temp => {
      this.checkPort();
      const {
        ventEnabled,
        heaterEnabled
      } = this.params;
      const tempStr = `${+temp}`;
      const sendStr = `${+ventEnabled}${+heaterEnabled} ${tempStr}${tempStr.length === 2 ? '.0' : ''}`;
      this.logger.debug(`SEND::: ${sendStr}`);
      this.port.write(sendStr.trim());
      this.params = _objectSpread({}, this.params, {
        temp
      });
    });

    _defineProperty(this, "subscribe", () => {
      this.parser.on('data', dataString => {
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
            ventEnabled: Boolean(+ventEnabled),
            heaterEnabled: Boolean(+heaterEnabled),
            temp: +temp,
            frequency: +frequency / 2,
            heaterWatts
          };
          this.context.controllers.Events.send('temperatureFromVent', this.params);
          this.logger.info(this.params);
        } else {
          if (type === 'F') {
            this.context.controllers.Telegram.debouncedBroadcastSend(data).catch(e => {});
          }

          this.logger.info({
            msgType: type,
            data
          });
        }
      });
    });

    _defineProperty(this, "handle_20_Second", () => {
      this.logger.debug({
        name: this.name
      }, 'Start 20 second handler');
      this.ventByCo2AndTemp();
    });

    _defineProperty(this, "ventByCo2AndTemp", () => {
      const {
        Co2Room,
        Temp
      } = this.context.sensors;
      const co2Value = Co2Room.value.value;
      const insideTmpValue = Temp.value.inside;
      const ventControllerTemp = this.params.temp;

      _logger.default.debug({
        co2Value,
        insideTmpValue,
        ventControllerTemp
      }, 'ventByCo2AndTemp');

      this.logger.trace({
        tempDelta: ventControllerTemp - insideTmpValue,
        tmpTreshold: this.TMP_TRESHOLD,
        co2MaxTreshold: this.CO2_MAX_TRESHOLD,
        co2MinTreshold: this.CO2_MIN_TRESHOLD
      }, 'ventByCo2AndTemp');

      if (ventControllerTemp - insideTmpValue > this.TMP_TRESHOLD) {
        _logger.default.info({
          msgType: 'ventByCo2AndTemp'
        }, 'Enable by temp treshold');

        this.enable();
        return;
      }

      if (co2Value > this.CO2_MAX_TRESHOLD) {
        _logger.default.info({
          msgType: 'ventByCo2AndTemp'
        }, 'Enable by CO2 treshold');

        this.enable();
      }

      if (co2Value < this.CO2_MIN_TRESHOLD) {
        _logger.default.info({
          msgType: 'ventByCo2AndTemp'
        }, 'Disable by CO2 treshold');

        this.disable();
      }
    });

    this.logger = context.logger;
    this.context = context;
    const port = new _serialport.default(VENT_SERIAL_PORT, {
      baudRate: 38400
    });
    this.port = port;
    this.parser = port.pipe(new _parserReadline.default({
      delimiter: '\n'
    }));
    port.on('open', () => {
      this.connected = true;
      this.subscribe();
    });
    this.context.controllers.Vent = this;
    this.logger.debug('controllers/Vent started');
  }

}

exports.Vent = Vent;