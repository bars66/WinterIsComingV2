"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _CardHeader = _interopRequireDefault(require("@material-ui/core/CardHeader"));

var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _getCO2color = _interopRequireDefault(require("../utils/getCO2color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CO2 = ({
  value,
  lastUpdate,
  st,
  lastTrueValue
}) => {
  let body;

  if (lastTrueValue) {
    body = _react.default.createElement(_CardContent.default, null, _react.default.createElement(_Typography.default, null, "Last stable: val: ", _react.default.createElement("b", null, lastTrueValue.value), " at ", new Date(+lastTrueValue.lastUpdate).toISOString()));
  }

  return _react.default.createElement(_Card.default, {
    style: {
      marginBottom: '20px'
    }
  }, _react.default.createElement(_CardHeader.default, {
    title: "CO2",
    titleTypographyProps: {
      variant: 'display2'
    },
    subheader: _react.default.createElement(_react.default.Fragment, null, new Date(+lastUpdate).toISOString(), "; st: ", st),
    avatar: _react.default.createElement(_Avatar.default, {
      style: {
        width: 60,
        height: 60,
        color: '#fff',
        backgroundColor: (0, _getCO2color.default)(value)
      }
    }, value)
  }), !!body && body);
};

var _default = (0, _reactRedux.connect)(({
  co2
}) => co2)(CO2);

exports.default = _default;