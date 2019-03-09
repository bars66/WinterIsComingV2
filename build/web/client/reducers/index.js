"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _vent = _interopRequireDefault(require("./vent"));

var _loading = _interopRequireDefault(require("./loading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reducers = (0, _redux.combineReducers)({
  isLoading: _loading.default,
  vent: _vent.default
});
var _default = reducers;
exports.default = _default;