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

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _setGrlnd = _interopRequireDefault(require("../actions/setGrlnd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Grlnd extends _react.default.Component {
  render() {
    const {
      pwmRY,
      pwmGB,
      time,
      setGrlnd,
      small
    } = this.props;
    console.log('AAA', setGrlnd); // const { value: valueFromState } = this.state
    // const tempForShown = valueFromState.toFixed(2) !== temp.toFixed(2) ? valueFromState : temp

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
    }, _react.default.createElement(_Typography.default, null, _react.default.createElement("b", null, "PWM_GB: ", pwmGB, "; PWM_RY: ", pwmRY, "; time: ", time)))), _react.default.createElement(_Divider.default, null), _react.default.createElement(_Button.default, {
      variant: "outlined",
      onClick: () => setGrlnd(!(pwmRY || pwmGB || time) ? {
        pwmRY: 999,
        pwmGB: 999,
        time: 0
      } : {
        pwmRY: 0,
        pwmGB: 0,
        time: 0
      })
    }, !(pwmRY || pwmGB || time) ? 'Включить' : 'Выключить')));
  }

}

var _default = (0, _reactRedux.connect)(({
  grlnd
}) => grlnd, dispatch => ({
  setGrlnd: opts => dispatch((0, _setGrlnd.default)(opts))
}))(Grlnd);

exports.default = _default;