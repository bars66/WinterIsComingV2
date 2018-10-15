"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractSensor = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AbstractSensor {
  constructor() {
    _defineProperty(this, "getValues", () => {
      return this.value;
    });
  }

}

exports.AbstractSensor = AbstractSensor;