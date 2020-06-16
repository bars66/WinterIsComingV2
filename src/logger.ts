require('dotenv').config()

import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'Object-Controller',
  level: 'trace',
  streams: [
    {
      stream: process.stdout
      // `type: 'stream'` is implied
    }
    // {
    //   type: 'raw',
    //   stream: logzioStream
    // }
  ]
})

export default logger
