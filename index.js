require('dotenv').config();
const SerialPort = require('serialport');
const logger = require('logzio-nodejs').createLogger({
  token: process.env.LOGZIO_TOKEN,
  host: 'listener.logz.io',
  type: 'winterIsComing2'
});

const SERIAL_PORT = process.env.SERIAL_PORT;

const port = new SerialPort(SERIAL_PORT, {
  baudRate: 9600
});

port.on('data', function (dataBuffer) {
  
  const dataString = dataBuffer.toString('utf8');
  const [type, data] = dataString.split('=');

  if (type === 'I') {
    const [canaltTmp, insideTmp, timeDelta, heaterPower, ventEnabled] = data.split(';');
    const frequency = (1 / timeDelta) * 1000000;
    const heaterWatts = heaterPower * 240;

    logger.log({
      msgType: type,
      canaltTmp: +canaltTmp, insideTmp: +insideTmp, timeDelta, heaterPower: +heaterPower, ventEnabled: Boolean(ventEnabled),
      frequency: +frequency / 2, heaterWatts,
    });

    return;
  }

  logger.log({
    msgType: type,
    data,
  });
});
