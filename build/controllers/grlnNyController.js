"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GrlndNyController = void 0;

var _requestPromise = _interopRequireDefault(require("request-promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const grlndUrl = process.env.GRLND_NY;

class GrlndNyController {
  constructor(context) {
    _defineProperty(this, "name", 'controllers/GrlndNY');

    _defineProperty(this, "params", {
      time: 0,
      pwmRY: 0,
      pwmGB: 0
    });

    _defineProperty(this, "changeParams", async ({
      pwmRY,
      pwmGB
    }) => {
      const options = {
        method: 'GET',
        uri: grlndUrl + '?PWM1=' + pwmRY + '&PWM2=' + pwmGB
      };
      this.params.time = 0;
      this.params.pwmRY = pwmRY;
      this.params.pwmGB = pwmGB;

      try {
        const result = await (0, _requestPromise.default)(options);
        this.logger.trace(result, 'Grlnd change result');
      } catch (e) {
        this.logger.error({
          name: this.name,
          e,
          stackTrace: e.stackTrace
        }, 'Grlnd change error');
      }
    });

    _defineProperty(this, "setBlink", async ({
      time
    }) => {
      const options = {
        method: 'GET',
        uri: grlndUrl + '?PWM1=999&PWM2=0&time=' + time
      };
      this.params.time = time;

      try {
        const result = await (0, _requestPromise.default)(options);
        this.logger.trace(result, 'Grlnd setBlink result');
      } catch (e) {
        this.logger.error({
          name: this.name,
          e,
          stackTrace: e.stackTrace
        }, 'Grlnd setBlink error');
      }
    });

    _defineProperty(this, "handle_Minute", () => {});

    this.logger = context.logger;
    this.context = context;
    this.context.controllers.GrlndNyController = this;
    this.logger.debug(this.name + ' started');
  }

}

exports.GrlndNyController = GrlndNyController;