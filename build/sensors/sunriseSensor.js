"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sunrise = void 0;

var _suncalc = require("suncalc");

var _abstractSensor = require("./abstractSensor");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const [lat, lon] = process.ENV.COORDS_FOR_SUN.split(',');

class Sunrise extends _abstractSensor.AbstractSensor {
  constructor(context) {
    super();

    _defineProperty(this, "value", {});

    _defineProperty(this, "handle_Minute", () => {
      this.value = _suncalc.SunCalc.getTimes(new Date(), lat, lon);
    });

    this.context = context;
    this.logger = context.logger;
    this.context.sensors.Sunrise = this;
    this.logger.debug('sensors/Sunrise started');
  }

}

exports.Sunrise = Sunrise;