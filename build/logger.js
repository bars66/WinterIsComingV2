"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bunyan = _interopRequireDefault(require("bunyan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const logger = _bunyan.default.createLogger({
  name: 'Object-Controller',
  level: 'trace',
  streams: [{
    stream: process.stdout // `type: 'stream'` is implied
    // {
    //   type: 'raw',
    //   stream: logzioStream
    // }

  }]
});

var _default = logger;
exports.default = _default;