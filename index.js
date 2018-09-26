require('dotenv').config();
const SerialPort = require('serialport');
const logger = require('logzio-nodejs').createLogger({
  token: process.env.LOGZIO_TOKEN,
  host: 'listener.logz.io',
  type: 'winterIsComing2'
});
module.exports = {
  logger,
}
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TG_BOT, {polling: true});
const co2Sensor = require('./co2Sensor');
new co2Sensor();

let iObj = {};
let tgLastUserInfo = {};

const SERIAL_PORT = process.env.SERIAL_PORT;

const port = new SerialPort(SERIAL_PORT, {
  baudRate: 38400
});

port.on('data', function (dataBuffer) {
  
  const dataString = dataBuffer.toString('utf8');
  const [type, data] = dataString.split('=');

  if (type === 'I') {
    const [canaltTmp, insideTmp, timeDelta, heaterPowerAvg, ventEnabled, heaterEnabled, temp] = data.split(';');
    const frequency = (1 / timeDelta) * 1000000;
    const heaterPower = +heaterPowerAvg / 5;
    const heaterWatts = heaterPower * 240;

    iObj = {
      msgType: type,
      canaltTmp: +canaltTmp, insideTmp: +insideTmp, timeDelta, heaterPower: +heaterPower, ventEnabled: Boolean(ventEnabled),
      heaterEnabled: Boolean(heaterEnabled),
      temp: +temp,
      frequency: +frequency / 2, heaterWatts,
    };

    logger.log(iObj);
    console.log(JSON.stringify(iObj, null, 4));
    return;
  }

  logger.log({
    msgType: type,
    data,
  });
});

bot.onText(/disabled/, (msg, match) => {
  port.write('00 24.5');
  const chatId = msg.chat.id;
  tgLastUserInfo = msg;
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'DISABLED');
  setTimeout(() => {
    bot.sendMessage(chatId, JSON.stringify(iObj, null, 2));
  }, 10 * 1000);
});

bot.onText(/enabled/, (msg, match) => {
  port.write('11 24.5');
  const chatId = msg.chat.id;
  tgLastUserInfo = msg;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'ENABLED');
  setTimeout(() => {
    bot.sendMessage(chatId, JSON.stringify(iObj, null, 2));
  }, 10 * 1000);
});

bot.onText(/status/, (msg, match) => {
  const chatId = msg.chat.id;
  tgLastUserInfo = msg;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, JSON.stringify(iObj, null, 2));
});

bot.onText(/iamadmin (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  tgLastUserInfo = msg;

  const chatId = msg.chat.id;
  const resp = match[1];
  port.write(resp);

  // send back the matched "whatever" to the chat
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, `SEND ${resp}`);
  setTimeout(() => {
    bot.sendMessage(chatId, JSON.stringify(iObj, null, 2));
  }, 10 * 1000);});

bot.on('polling_error', (error) => {
  console.log(error);  // => 'EFATAL'
});

bot.onText(/log/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, JSON.stringify(tgLastUserInfo, null, 2));
});