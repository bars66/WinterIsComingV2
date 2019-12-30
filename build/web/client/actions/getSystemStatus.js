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
    manualControl
    switchReason {
      isEnabled
      reason
      time
    }
  }
  co2 {
    value
    lastUpdate
    st
    lastTrueValue {
      value
      lastUpdate
    }
  }
  temps {
    inside
    canal
    lastUpdate
  }
  
  grlnd {
    pwmRY
    pwmGB
    time
    userBrightness
  }
  
  weather {
    currently {
      ...Forecast
    }
    hourly {
      ...Forecast
    }
  }
}

fragment Forecast on Forecast {
  time {
    unix
    text
  }
  temperature
  windSpeed
  precipType
  precipProbability
  summary
  icon
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

    if (data.co2) {
      dispatch({
        type: '@@co2/UPDATE',
        payload: data.co2
      });
    }

    if (data.temps) {
      dispatch({
        type: '@@temps/UPDATE',
        payload: data.temps
      });
    }

    if (data.weather) {
      dispatch({
        type: '@@forecast/UPDATE',
        payload: data.weather
      });
    }

    if (data.grlnd) {
      console.log(data.grlnd);
      dispatch({
        type: '@@grlnd/UPDATE',
        payload: data.grlnd
      });
    }

    dispatch({
      type: '@@loading/COMPLETE'
    });
  };
};

exports.default = _default;