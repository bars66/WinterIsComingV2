"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sunrise = void 0;

var _suncalc = _interopRequireDefault(require("suncalc"));

var _abstractSensor = require("./abstractSensor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const [lat, lon] = process.env.COORDS_FOR_SUN.split(',');
const mockedSunriseTime = new Date(new Date() + 2 * 60 * 1000);

class Sunrise extends _abstractSensor.AbstractSensor {
  constructor(context) {
    super();

    _defineProperty(this, "value", {});

    _defineProperty(this, "handle_Minute", () => {
      this.value = _suncalc.default.getTimes(new Date(), lat, lon);
      this.value.sunrise = mockedSunriseTime;
    });

    this.context = context;
    this.logger = context.logger;
    this.context.sensors.Sunrise = this;
    this.logger.debug('sensors/Sunrise started');
  }

}

exports.Sunrise = Sunrise;