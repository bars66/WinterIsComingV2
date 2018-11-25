"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Events = void 0;

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Events extends _events.default {
  constructor(context) {
    super();

    _defineProperty(this, "send", (name, ...values) => {
      this.logger.trace({
        name,
        values
      }, 'Event emit');
      this.emit(name, ...values);
    });

    this.context = context;
    this.logger = context.logger;
    this.context.controllers.Events = this;
    this.logger.debug('controllers/Events started');
  }

}

exports.Events = Events;