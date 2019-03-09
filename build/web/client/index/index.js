"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Slider = _interopRequireDefault(require("@material-ui/lab/Slider"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class StepSlider extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      value: 3
    });

    _defineProperty(this, "handleChange", (event, value) => {
      this.setState({
        value
      });
    });
  }

  render() {
    const {
      classes
    } = this.props;
    const {
      value
    } = this.state;
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Typography.default, {
      component: "h2",
      variant: "display1",
      gutterBottom: true
    }, "\u0412\u0435\u043D\u0442\u0438\u043B\u044F\u0446\u0438\u044F"), _react.default.createElement(_Slider.default, {
      value: value,
      min: 0,
      max: 6,
      step: 1,
      onChange: this.handleChange
    }));
  }

}

var _default = StepSlider;
exports.default = _default;