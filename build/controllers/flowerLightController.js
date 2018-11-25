"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlowerLightController = void 0;

var _requestPromise = _interopRequireDefault(require("request-promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const flowerLightUrl = process.env.FLOWER_LIGHT;

class FlowerLightController {
  constructor(context) {
    _defineProperty(this, "name", 'controllers/FlowerLight');

    _defineProperty(this, "FLOWER_LIGHT_TIME", 12 * 60 * 60 * 1000);

    _defineProperty(this, "params", {});

    _defineProperty(this, "switchRelay", async (number, state) => {
      const options = {
        method: 'GET',
        uri: flowerLightUrl + 'api/relayChange' + `?relay=${number}&state=${state}`
      };

      try {
        const result = await (0, _requestPromise.default)(options);
        this.logger.trace(result, 'Relay change result');
      } catch (e) {
        this.logger.error({
          name: this.name,
          e,
          stackTrace: e.stackTrace
        }, 'Relay change error');
      }
    });

    _defineProperty(this, "getRelayStatus", async () => {
      const options = {
        method: 'GET',
        uri: flowerLightUrl + 'api/relayState',
        json: true
      };

      try {
        const result = await (0, _requestPromise.default)(options);
        this.params.relayValues = result.data.relays;
      } catch (e) {
        console.log(e);
        this.logger.error({
          name: this.name,
          e,
          stackTrace: e.stackTrace
        }, 'Relay get status error');
      }
    });

    _defineProperty(this, "handle_Minute", () => {
      this.enableOrDisableRelaysBySunrise();
      this.getRelayStatus();
    });

    _defineProperty(this, "enableOrDisableRelaysBySunrise", () => {
      const solarTimes = this.context.sensors.Sunrise.value;
      if (!solarTimes || !solarTimes.sunrise) return;
      const sunriseTime = solarTimes.sunrise;

      if (new Date() > new Date(sunriseTime.getTime() + this.FLOWER_LIGHT_TIME)) {
        setTimeout(() => {
          this.logger.info({
            name: this.name
          }, 'Disable 1 relay by sunrise time');
          this.switchRelay(1, 'disable');
        }, 1000);
        setTimeout(() => {
          this.logger.info({
            name: this.name
          }, 'Disable 2 relay by sunrise time');
          this.switchRelay(2, 'disable');
        }, 5000);
        return;
      }

      if (new Date() > sunriseTime) {
        setTimeout(() => {
          this.logger.info({
            name: this.name
          }, 'Enable 1 relay by sunrise time');
          this.switchRelay(1, 'enable');
        }, 1000);
        setTimeout(() => {
          this.logger.info({
            name: this.name
          }, 'Enable 2 relay by sunrise time');
          this.switchRelay(2, 'enable');
        }, 5000);
      }
    });

    this.logger = context.logger;
    this.context = context;
    this.context.controllers.FlowerLight = this;
    this.logger.debug('controllers/ FlowerLight started');
  }

}

exports.FlowerLightController = FlowerLightController;