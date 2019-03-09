"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.App = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _LinearProgress = _interopRequireDefault(require("@material-ui/core/LinearProgress"));

var _getSystemStatus = _interopRequireDefault(require("./actions/getSystemStatus"));

var _index = _interopRequireDefault(require("./vent/index"));

var _getCO2color = _interopRequireDefault(require("./utils/getCO2color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function genValues() {
  let a = [];

  for (let i = 390; i != 2000; ++i) {
    a.push(i);
  }

  return a;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "intervalId", void 0);
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.props.updateSystemStatus();
    }, 1000);
  }

  componentWillUnmount() {
    this.intervalId && clearInterval(this.timerId);
  }

  render() {
    const {
      statusColor,
      sysStatus,
      isLoading
    } = this.props;
    return React.createElement("div", {
      style: {
        maxWidth: '100%',
        overflowX: 'hidden',
        padding: '10px'
      }
    }, React.createElement(_CssBaseline.default, null), React.createElement(_Typography.default, {
      component: "h2",
      variant: "display2",
      gutterBottom: true
    }, "WiC V2.1. ", React.createElement("span", {
      style: {
        color: statusColor
      }
    }, sysStatus)), React.createElement(_Divider.default, null), !this.props.isLoading ? React.createElement(React.Fragment, null, React.createElement(_LinearProgress.default, null), React.createElement("br", null), React.createElement(_LinearProgress.default, {
      color: "secondary"
    })) : React.createElement(React.Fragment, null, React.createElement(_index.default, null)));
  }

}

exports.App = App;

var _default = (0, _reactRedux.connect)(({
  isLoading
}) => {
  return {
    isLoading,
    sysStatus: !isLoading ? 'Fatal' : 'Stable',
    statusColor: !isLoading ? 'red' : 'green'
  };
}, dispatch => ({
  updateSystemStatus: () => {
    dispatch((0, _getSystemStatus.default)());
  }
}))(App);

exports.default = _default;