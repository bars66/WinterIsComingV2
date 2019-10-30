"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Camera = void 0;

var _nodeRtspStream = _interopRequireDefault(require("node-rtsp-stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const RTSP = process.env.RTSP;

class Camera {
  constructor(context) {
    _defineProperty(this, "name", 'controllers/Camera');

    _defineProperty(this, "params", {});

    _defineProperty(this, "stream", void 0);

    this.logger = context.logger;
    this.context = context;
    this.context.controllers.Camera = this;
    this.logger.debug('controllers/Camera started');
  }

  start() {
    if (this.stream) return;
    this.stream = new _nodeRtspStream.default({
      name: 'name',
      streamUrl: RTSP,
      wsPort: 9999,
      ffmpegOptions: {
        // options ffmpeg flags
        '-stats': '',
        // an option with no neccessary value uses a blank string
        '-r': 30 // options with required values specify the value after the key

      }
    });
  }

  stop() {
    if (this.stream) this.stream.stop();
  }

}

exports.Camera = Camera;