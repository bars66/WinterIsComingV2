"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _card = _interopRequireDefault(require("./card"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Forecast extends _react.default.Component {
  render() {
    const currently = this.props.forecast.currently;
    const nowHours = new Date().getHours();
    const hourly = nowHours < 7 || nowHours > 21 ? this.props.forecast.hourly[0] : this.props.forecast.hourly[1];
    return _react.default.createElement(_Grid.default, {
      container: true,
      spacing: 8
    }, _react.default.createElement(_Grid.default, {
      item: true,
      xs: 6
    }, _react.default.createElement(_card.default, {
      forecast: currently
    })), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 6
    }, _react.default.createElement(_card.default, {
      forecast: hourly
    })));
  }

} // icon: "partly-cloudy-night"
// precipProbability: 0.05
// precipType: "rain"
// summary: "Небольшая Облачность"
// temperature: 9.56
// time: {unix: "1568493645000", text: "Sat Sep 14 2019 23:40:45 GMT+0300 (Москва, стандартное время)"}
// windSpeed: 3.5


var _default = (0, _reactRedux.connect)(({
  forecast
}) => ({
  forecast
}))(Forecast);

exports.default = _default;