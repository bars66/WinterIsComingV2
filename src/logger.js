require('dotenv').config()

const bunyan = require('bunyan')
const LogzioBunyanStream = require('logzio-bunyan')

const logzioStream = new LogzioBunyanStream({
  token: process.env.LOGZIO_TOKEN
})

const logger = bunyan.createLogger({
  name: 'Object-Controller',
  level: 'debug',
  streams: [
    {
      stream: process.stdout
      // `type: 'stream'` is implied
    },
    {
      type: 'raw',
      stream: logzioStream
    }
  ]
})

module.exports = logger
