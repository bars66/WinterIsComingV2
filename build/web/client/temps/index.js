"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Slider = _interopRequireDefault(require("@material-ui/lab/Slider"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _reactRedux = require("react-redux");

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _CardHeader = _interopRequireDefault(require("@material-ui/core/CardHeader"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Temps = ({
  inside,
  canal
}) => {
  return _react.default.createElement(_Card.default, null, _react.default.createElement(_CardHeader.default, {
    title: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u044B",
    titleTypographyProps: {
      variant: 'display1'
    },
    avatar: _react.default.createElement(_Avatar.default, {
      style: {
        width: 60,
        height: 60,
        color: '#fff',
        backgroundColor: '#4caf50'
      }
    }, "+", inside)
  }), _react.default.createElement(_CardContent.default, null, _react.default.createElement(_Grid.default, {
    container: true,
    spacing: 0
  }, _react.default.createElement(_Grid.default, {
    item: true,
    xs: 3
  }, _react.default.createElement(_Typography.default, null, "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F:")), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 9
  }, _react.default.createElement(_Typography.default, null, _react.default.createElement("b", null, inside))), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 3
  }, _react.default.createElement(_Typography.default, null, "\u041A\u0430\u043D\u0430\u043B\u044C\u043D\u0430\u044F:")), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 9
  }, _react.default.createElement(_Typography.default, null, canal)))));
};

var _default = (0, _reactRedux.connect)(({
  temps
}) => temps)(Temps);

exports.default = _default;