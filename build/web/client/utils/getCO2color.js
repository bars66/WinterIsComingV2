"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getCO2Color;

var _gradientColor = _interopRequireDefault(require("gradient-color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const colors = (0, _gradientColor.default)(['#00e676', '#43a047', '#ffc107', '#f57c00', '#ff5722'], 600);

function getCO2Color(value) {
  const v = Math.max(value - 400, 0);
  if (v >= colors.length) return colors[colors.length - 1];
  return colors[v];
}