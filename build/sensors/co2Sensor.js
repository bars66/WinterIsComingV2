"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Co2Sensor = void 0;

var _abstractSensor = require("./abstractSensor");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv').config();

const PORT = '/dev/ttyS2';
const DEBUG = process.env.DEBUG;

const SerialPort = require('serialport');

const Readline = SerialPort.parsers.Readline;

class Co2Sensor extends _abstractSensor.AbstractSensor {
  constructor(logger) {
    super();

    _defineProperty(this, "value", {});

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
          _lastUpdate: new Date()
        };
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
      logger.debug('Create mocked serialport');
    }
  }

}

exports.Co2Sensor = Co2Sensor;

_defineProperty(Co2Sensor, "getSingletone", logger => {
  if (!Co2Sensor.instance) {
    Co2Sensor.instance = new Co2Sensor(logger);
  }

  return Co2Sensor.instance;
});