"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Co2Room = void 0;

var _abstractSensor = require("./abstractSensor");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv').config();

const PORT = '/dev/ttyS2';
const DEBUG = process.env.DEBUG;

const SerialPort = require('serialport');

const Readline = SerialPort.parsers.Readline;

class Co2Room extends _abstractSensor.AbstractSensor {
  constructor(context) {
    super();

    _defineProperty(this, "value", {});

    this.context = context;
    this.logger = context.logger;
    const logger = this.logger;
    this.cmd = new Buffer([0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79]);

    if (!DEBUG) {
      this.port = new SerialPort(PORT, {
        baudRate: 9600,
        dataBits: 8,
        parity: 'none'
      });
      this.port.on('data', b => {
        const cs = 255 - (b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + b[7]) % 256 + 1;

        if (cs !== b[8]) {
          logger.info('CO2 incorrect control summ');
          return;
        }

        this.value = {
          value: 256 * b[2] + b[3],
          temp: b[4] - 40,
          st: Number(b[5]),
          u: 256 * b[6] + b[7],
          lastUpdate: new Date()
        };

        if (this.value.st === 64) {
          this.lastTrueValue = _objectSpread({}, this.value);
        }

        this.value = _objectSpread({}, this.value, {
          lastTrueValue: this.lastTrueValue
        });
        logger.info(_objectSpread({}, this.value, {
          msgType: 'CO2_METRIC'
        }), 'CO2 value');
      });
      logger.debug(PORT, 'Connect to CO2 port');
      this.port.write(this.cmd);
      setInterval(() => {
        this.port.write(this.cmd);
      }, 20 * 1000);
    } else {
      this.port = {
        write: (...args) => {
          logger.info(args, 'Write in SerialPort');
        }
      };
      this.value = {
        value: 1900,
        lastUpdate: new Date(),
        st: 4,
        lastTrueValue: {
          value: 900,
          lastUpdate: new Date(),
          st: 64
        }
      };
      logger.debug('Create mocked serialport');
    }

    this.context.sensors.Co2Room = this;
    this.logger.debug('sensors/Co2Room started');
  }

}

exports.Co2Room = Co2Room;