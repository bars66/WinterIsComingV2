"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TempSensor = void 0;

var _ventController = require("../controllers/ventController");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TempSensor {
  constructor(logger) {
    _defineProperty(this, "value", {});

    _defineProperty(this, "subscribe", () => {
      this.vC.on('values', ({
        canalTmp,
        insideTmp
      }) => {
        this.value = {
          canal: canalTmp,
          inside: insideTmp
        };
      });
    });

    this.vC = _ventController.VentController.getSingletone(logger);
    this.subscribe();
  }

}

exports.TempSensor = TempSensor;

_defineProperty(TempSensor, "getSingletone", logger => {
  if (!TempSensor.instance) {
    TempSensor.instance = new TempSensor(logger);
  }

  return TempSensor.instance;
});