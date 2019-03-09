"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fetchGql = _interopRequireDefault(require("../fetchGql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const query = `
query getVentStatus{
  vent {
    canaltTmp
    insideTmp
    heaterPower
    ventEnabled
    heaterEnabled
    temp
    heaterWatts
    lastAnswer
    switchReason {
      isEnabled
      reason
      time
    }
  }
}`;

var _default = () => {
  return async (dispatch, getState) => {
    const data = await (0, _fetchGql.default)(query);

    if (data.vent) {
      dispatch({
        type: '@@vent/UPDATE',
        payload: data.vent
      });
    }

    dispatch({
      type: '@@loading/COMPLETE'
    });
  };
};

exports.default = _default;