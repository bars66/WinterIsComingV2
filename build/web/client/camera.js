"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.App = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));

var _LinearProgress = _interopRequireDefault(require("@material-ui/core/LinearProgress"));

var _core = require("@material-ui/core");

var _jsmpegPlayer = _interopRequireDefault(require("@cycjimmy/jsmpeg-player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class App extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "intervalId", void 0);
  }

  componentDidMount() {
    new _jsmpegPlayer.default.VideoElement('#videoWrapper', `ws://${window.location.hostname}:9999`);
  }

  componentWillUnmount() {
    this.intervalId && clearInterval(this.timerId);
  }

  render() {
    return React.createElement("div", {
      style: {
        maxWidth: '100%',
        overflowX: 'hidden',
        padding: '10px'
      }
    }, React.createElement("div", {
      id: "videoWrapper",
      style: {
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%' // 16:9

      }
    }));
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
  updateSystemStatus: () => {}
}))(App);

exports.default = _default;