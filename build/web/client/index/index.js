"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/core/styles");

var _Slider = _interopRequireDefault(require("@material-ui/lab/Slider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const styles = {
  root: {
    width: 300
  },
  slider: {
    padding: '22px 0px'
  }
};

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
    return _react.default.createElement("div", {
      className: classes.root
    }, _react.default.createElement(_Slider.default, {
      classes: {
        container: classes.slider
      },
      value: value,
      min: 0,
      max: 6,
      step: 1,
      onChange: this.handleChange
    }));
  }

}

var _default = (0, _styles.withStyles)(styles)(StepSlider);

exports.default = _default;