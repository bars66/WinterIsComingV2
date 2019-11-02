"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScheduleController = void 0;

var _nedbPromise = _interopRequireDefault(require("nedb-promise"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getSecondsFromTime = time => {
  const parsedTime = time.split(':').map(Number);
  return parsedTime[0] * 3600 + parsedTime[1] * 60;
};

class ScheduleController {
  constructor(context) {
    _defineProperty(this, "name", 'controllers/Scheduler');

    _defineProperty(this, "isLoaded", false);

    _defineProperty(this, "addAction_temperature", async action => {
      const {
        from,
        to,
        temp,
        needReturnOriginalAfter
      } = action;
      await this.db.actions.insert({
        type: 'temperature',
        from: getSecondsFromTime(from),
        to: getSecondsFromTime(to),
        params: {
          temp,
          needReturnOriginalAfter: !!needReturnOriginalAfter
        }
      });
    });

    _defineProperty(this, "addAction", async action => {
      await this[`addAction_${action.type}`](action);
    });

    _defineProperty(this, "planeAction", async () => {
      const now = (0, _moment.default)().format("HH:mm");
      const nowSeconds = getSecondsFromTime(now);
      const actions = await this.db.actions.find({
        from: {
          $lte: nowSeconds
        },
        to: {
          $gte: nowSeconds
        }
      });
      if (!actions || !actions.length) return; // const isScheduled =

      console.log(actions);
    });

    _defineProperty(this, "handle_Second", async () => {
      await this.planeAction(); // await this.addAction({type: 'temperature', from: '00:00', to: '03:00', temp: '+1.5'})

      console.log((0, _moment.default)().format("HH:mm"));
    });

    this.logger = context.logger;
    this.context = context;
    this.context.controllers.Camera = this;
    this.logger.debug('controllers/Camera started');
    this.db = new _nedbPromise.default({
      filename: './scheduler.db',
      autoload: true
    });
    this.db = {};
    this.db.actions = new _nedbPromise.default({
      filename: './db/scheduler/actions.db',
      autoload: true
    });
    this.db.plane = new _nedbPromise.default({
      filename: './db/scheduler/plane.db',
      autoload: true
    });
  }

}

exports.ScheduleController = ScheduleController;