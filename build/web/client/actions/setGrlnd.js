"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fetchGql = _interopRequireDefault(require("../fetchGql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const query = `
mutation setGrlnd($pwmRY: Int, $pwmGB: Int, $time: Int) {
  setGrlnd(pwmGB: $pwmGB, pwmRY: $pwmRY, time: $time)
}
`;

var _default = opts => {
  return async (dispatch, getState) => {
    await (0, _fetchGql.default)(query, _objectSpread({}, opts));
  };
};

exports.default = _default;