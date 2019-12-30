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

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _setGrlnd = _interopRequireDefault(require("../actions/setGrlnd"));

var _debounce = _interopRequireDefault(require("debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Grlnd extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      value: this.props.time
    });

    _defineProperty(this, "debouncedSetGrlnd", (0, _debounce.default)(this.props.setGrlnd, 500));

    _defineProperty(this, "handleChange", (event, value) => {
      this.setState({
        value
      });
      this.debouncedSetGrlnd({
        time: value
      });
    });

    _defineProperty(this, "handleChangeBrightness", (event, value) => {
      this.setState({
        brightness: value
      });
      this.debouncedSetGrlnd({
        pwmRY: value,
        pwmGB: value,
        time: 0
      });
    });
  }

  render() {
    const {
      pwmRY,
      pwmGB,
      time,
      setGrlnd,
      small
    } = this.props;
    const {
      value: timeValueFromState,
      brightness
    } = this.state; // const tempForShown = valueFromState.toFixed(2) !== temp.toFixed(2) ? valueFromState : temp

    const isEnabled = pwmRY || pwmGB || time;
    return _react.default.createElement(_Card.default, {
      style: !small ? {
        marginBottom: '20px'
      } : {
        marginBottom: '-20px'
      }
    }, _react.default.createElement(_CardHeader.default, {
      title: "GRLND",
      titleTypographyProps: {
        variant: 'display1'
      }
    }), _react.default.createElement(_CardContent.default, {
      style: small ? {
        marginTop: '-30px'
      } : {}
    }, !small && _react.default.createElement(_Grid.default, {
      container: true,
      spacing: 0
    }, _react.default.createElement(_Grid.default, {
      item: true,
      xs: 12
    }, _react.default.createElement(_Typography.default, {
      variant: "title"
    }, !!time ? 'Мигание' : pwmRY || pwmGB ? 'Включено' : 'Выключено')), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 3
    }, _react.default.createElement(_Typography.default, null, "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435:")), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 9
    }, _react.default.createElement(_Typography.default, null, _react.default.createElement("b", null, "PWM_GB: ", pwmGB, "; PWM_RY: ", pwmRY, "; time: ", time)))), _react.default.createElement(_Divider.default, null), _react.default.createElement("div", {
      style: {
        marginTop: '10px'
      }
    }, _react.default.createElement(_Button.default, {
      variant: "contained",
      color: !isEnabled ? 'primary' : 'secondary',
      onClick: () => setGrlnd(!isEnabled ? {
        pwmRY: this.props.userBrightness,
        pwmGB: this.props.userBrightness,
        time: 0
      } : {
        pwmRY: 0,
        pwmGB: 0,
        time: 0
      })
    }, !isEnabled ? 'Включить' : 'Выключить'), !!isEnabled && _react.default.createElement(_Button.default, {
      variant: "contained",
      color: "primary",
      onClick: () => setGrlnd({
        time: 100
      }),
      style: {
        marginLeft: '20px'
      }
    }, "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043C\u0438\u0433\u0430\u043D\u0438\u0435"), !!isEnabled && !time && _react.default.createElement("div", {
      style: {
        marginTop: '10px'
      }
    }, _react.default.createElement(_Typography.default, null, "\u042F\u0440\u043A\u043E\u0441\u0442\u044C, ", (pwmRY / 1000).toFixed(3), " %"), _react.default.createElement(_Slider.default, {
      style: {
        marginTop: '20px',
        marginBottom: '60px',
        marginLeft: '30px',
        marginRight: '10px',
        width: '90%'
      },
      value: +brightness || 999,
      min: 1,
      max: 999,
      step: 1,
      onChange: this.handleChangeBrightness
    })), !!time && _react.default.createElement("div", {
      style: {
        marginTop: '10px'
      }
    }, _react.default.createElement(_Typography.default, null, "T 1/4 \u043C\u0438\u0433\u0430\u043D\u0438\u044F, \u043C\u0441: ", timeValueFromState || 100), _react.default.createElement(_Slider.default, {
      style: {
        marginTop: '20px',
        marginBottom: '60px',
        marginLeft: '30px',
        marginRight: '10px',
        width: '90%'
      },
      value: +timeValueFromState || 100,
      min: 10,
      max: 500,
      step: 10,
      onChange: this.handleChange
    })))));
  }

}

var _default = (0, _reactRedux.connect)(({
  grlnd
}) => grlnd, dispatch => ({
  setGrlnd: opts => dispatch((0, _setGrlnd.default)(opts))
}))(Grlnd);

exports.default = _default;