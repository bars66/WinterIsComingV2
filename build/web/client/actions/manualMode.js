"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fetchGql = _interopRequireDefault(require("../fetchGql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const query = `
mutation manualHeater($isEnabled: Boolean, $manualControl: Boolean) {
  manualHeater(isEnabled: $isEnabled, manualControl: $manualControl)
}
`;

var _default = (isEnabled, manualControl) => {
  return async (dispatch, getState) => {
    await (0, _fetchGql.default)(query, {
      isEnabled,
      manualControl
    });
  };
};

exports.default = _default;