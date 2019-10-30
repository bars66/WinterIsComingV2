"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _vent = _interopRequireDefault(require("./vent"));

var _loading = _interopRequireDefault(require("./loading"));

var _co = _interopRequireDefault(require("./co2"));

var _temps = _interopRequireDefault(require("./temps"));

var _forecast = _interopRequireDefault(require("./forecast"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reducers = (0, _redux.combineReducers)({
  isLoading: _loading.default,
  vent: _vent.default,
  co2: _co.default,
  temps: _temps.default,
  forecast: _forecast.default
});
var _default = reducers;
exports.default = _default;