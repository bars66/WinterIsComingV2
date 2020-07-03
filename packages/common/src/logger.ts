import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'Object-Controller',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'trace',
  streams: [
    {
      stream: process.stdout,
    },
  ],
  serializers: {error: bunyan.stdSerializers.err},
});

export default logger;
