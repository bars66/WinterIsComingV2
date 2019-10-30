"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _CardHeader = _interopRequireDefault(require("@material-ui/core/CardHeader"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ForecastCard = ({
  forecast
}) => _react.default.createElement(_Card.default, {
  style: {
    marginBottom: '10px'
  }
}, _react.default.createElement(_CardHeader.default, {
  title: `${forecast.summary}`,
  titleTypographyProps: {
    variant: 'h5'
  },
  subheader: new Date(+forecast.time.unix).toISOString(),
  avatar: _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Avatar.default, {
    style: {
      width: 60,
      height: 60
    }
  }, _react.default.createElement("b", null, forecast.temperature)))
}), _react.default.createElement(_CardContent.default, {
  style: {
    marginTop: '-25px'
  }
}, !!forecast.precipProbability && _react.default.createElement(_Typography.default, null, "\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u043E\u0441\u0430\u0434\u043A\u043E\u0432: ", _react.default.createElement("b", null, forecast.precipProbability * 100), "%(", forecast.precipType, ")"), _react.default.createElement(_Typography.default, null, "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0432\u0435\u0442\u0440\u0430: ", _react.default.createElement("b", null, forecast.windSpeed), "\u043C/\u0441"))); // icon: "partly-cloudy-night"
// precipProbability: 0.05
// precipType: "rain"
// summary: "Небольшая Облачность"
// temperature: 9.56
// time: {unix: "1568493645000", text: "Sat Sep 14 2019 23:40:45 GMT+0300 (Москва, стандартное время)"}
// windSpeed: 3.5


var _default = ForecastCard;
exports.default = _default;