"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _context = _interopRequireDefault(require("./context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reducers = (0, _redux.combineReducers)({
  isLoading: (state = false) => state,
  context: _context.default
});
var _default = reducers;
exports.default = _default;