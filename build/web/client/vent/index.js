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

var _debounce = _interopRequireDefault(require("debounce"));

var _setTemp = _interopRequireDefault(require("../actions/setTemp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Vent extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      value: this.props.temp
    });

    _defineProperty(this, "debouncedSetTemp", (0, _debounce.default)(this.props.changeTemp, 500));

    _defineProperty(this, "handleChange", (event, value) => {
      this.setState({
        value
      });
      this.debouncedSetTemp(value);
    });

    _defineProperty(this, "getColorByStatus", () => {
      const {
        ventEnabled,
        temp,
        insideTmp
      } = this.props;
      const {
        value: valueFromState
      } = this.state;
      const tempForShown = valueFromState.toFixed(2) !== temp.toFixed(2) ? valueFromState : temp;
      if (!ventEnabled) return '#bdbdbd';
      if (temp.toFixed(2) !== insideTmp.toFixed(2)) return '#ffd54f';
      return '#4caf50';
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
      lastAnswer
    } = this.props;
    const {
      value: valueFromState
    } = this.state;
    const tempForShown = valueFromState.toFixed(2) !== temp.toFixed(2) ? valueFromState : temp;
    return _react.default.createElement(_Card.default, {
      style: {
        marginBottom: '20px'
      }
    }, _react.default.createElement(_CardHeader.default, {
      title: "\u0412\u0435\u043D\u0442\u0438\u043B\u044F\u0446\u0438\u044F",
      titleTypographyProps: {
        variant: 'display1'
      },
      subheader: new Date(+lastAnswer).toISOString(),
      avatar: _react.default.createElement(_Avatar.default, {
        style: {
          width: 60,
          height: 60,
          color: '#fff',
          backgroundColor: this.getColorByStatus()
        }
      }, _react.default.createElement("b", null, "+", tempForShown))
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
    }, _react.default.createElement(_Typography.default, null, new Date(+time).toISOString()))), _react.default.createElement(_Divider.default, null), _react.default.createElement(_Slider.default, {
      style: {
        marginTop: '20px'
      },
      value: tempForShown,
      min: 15,
      max: 28,
      step: 0.5,
      onChange: this.handleChange
    })));
  }

}

var _default = (0, _reactRedux.connect)(({
  vent
}) => vent, dispatch => ({
  changeTemp: temp => dispatch((0, _setTemp.default)(temp))
}))(Vent);

exports.default = _default;