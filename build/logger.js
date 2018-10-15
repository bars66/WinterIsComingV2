"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require('dotenv').config();

const bunyan = require('bunyan');

const LogzioBunyanStream = require('logzio-bunyan');

const logzioStream = new LogzioBunyanStream({
  token: process.env.LOGZIO_TOKEN
});
const logger = bunyan.createLogger({
  name: 'Object-Controller',
  level: 'debug',
  streams: [{
    stream: process.stdout // `type: 'stream'` is implied

  }, {
    type: 'raw',
    stream: logzioStream
  }]
});
var _default = logger;
exports.default = _default;