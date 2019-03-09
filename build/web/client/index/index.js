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

var _CardActions = _interopRequireDefault(require("@material-ui/core/CardActions"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Vent extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      value: this.props.temp
    });

    _defineProperty(this, "handleChange", (event, value) => {
      this.setState({
        value
      });
    });
  }

  render() {
    const {
      switchReason: {
        isEnabled,
        reason,
        time
      },
      temp,
      insideTemp,
      canalTemp
    } = this.props;
    const {
      value
    } = this.state;
    return _react.default.createElement(_Card.default, null, _react.default.createElement(_CardHeader.default, {
      title: "\u0412\u0435\u043D\u0442\u0438\u043B\u044F\u0446\u0438\u044F"
    }), _react.default.createElement(_CardContent.default, null, _react.default.createElement(_Grid.default, {
      container: true,
      spacing: 0
    }, _react.default.createElement(_Grid.default, {
      item: true,
      xs: 12
    }, _react.default.createElement(_Typography.default, {
      variant: "title"
    }, "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435.")), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 3
    }, _react.default.createElement(_Typography.default, null, "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435:")), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 9
    }, _react.default.createElement(_Typography.default, null, _react.default.createElement("b", null, isEnabled ? 'Включено' : 'Выключено'))), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 3
    }, _react.default.createElement(_Typography.default, null, "\u041F\u0440\u0438\u0447\u0438\u043D\u0430:")), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 9
    }, _react.default.createElement(_Typography.default, null, reason)), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 3
    }), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 9
    }, _react.default.createElement(_Typography.default, null, new Date(+time).toISOString()))), _react.default.createElement(_Divider.default, null), _react.default.createElement(_Grid.default, {
      container: true,
      spacing: 0
    }, _react.default.createElement(_Grid.default, {
      item: true,
      xs: 12
    }, _react.default.createElement(_Typography.default, {
      variant: "title"
    }, " \u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u044B.")), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 3
    }, _react.default.createElement(_Typography.default, null, "\u0417\u0430\u0434\u0430\u043D\u043D\u0430\u044F:")), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 9
    }, _react.default.createElement(_Typography.default, {
      variant: "title"
    }, _react.default.createElement("b", null, temp))), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 3
    }, _react.default.createElement(_Typography.default, null, "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F:")), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 9
    }, _react.default.createElement(_Typography.default, null, _react.default.createElement("b", null, insideTemp))), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 3
    }, _react.default.createElement(_Typography.default, null, "\u041A\u0430\u043D\u0430\u043B\u044C\u043D\u0430\u044F:")), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 9
    }, _react.default.createElement(_Typography.default, null, canalTemp))), _react.default.createElement(_Divider.default, null), _react.default.createElement(_Slider.default, {
      style: {
        marginTop: '20px'
      },
      value: value,
      min: 15,
      max: 30,
      step: 0.5,
      onChange: this.handleChange
    })));
  }

}

var _default = (0, _reactRedux.connect)(({
  vent
}) => vent)(Vent);

exports.default = _default;