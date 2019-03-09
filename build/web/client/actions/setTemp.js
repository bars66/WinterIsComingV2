"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fetchGql = _interopRequireDefault(require("../fetchGql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const query = `
mutation setTemp($temp: Float!) {
  setTemp(temp: $temp)
}
`;

var _default = temp => {
  return async (dispatch, getState) => {
    await (0, _fetchGql.default)(query, {
      temp
    });
  };
};

exports.default = _default;