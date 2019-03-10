"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Temp = void 0;

var _abstractSensor = require("./abstractSensor");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Temp extends _abstractSensor.AbstractSensor {
  constructor(context) {
    super();

    _defineProperty(this, "value", {});

    _defineProperty(this, "subscribe", () => {
      this.context.controllers.Events.on('temperatureFromVent', ({
        canaltTmp,
        insideTmp
      }) => {
        this.value = {
          canal: canaltTmp,
          inside: insideTmp,
          lastUpdate: new Date()
        };
      });
    });

    this.context = context;
    this.logger = context.logger;
    this.subscribe();
    this.context.sensors.Temp = this;
    this.logger.debug('sensors/Temp started');
  }

}

exports.Temp = Temp;