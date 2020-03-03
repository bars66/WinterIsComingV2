"use strict";

require('dotenv').config();

const path = require('path');

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TG_BOT, {
  polling: false
});

const ffmpeg = require('fluent-ffmpeg');

const RTSP = process.env.RTSP;
const CHAT_ID = process.env.TG_FLOWER_CHANNEL;

const _path = path.resolve(__dirname, './flowers.jpg');

command = ffmpeg(RTSP).frames(1).on('end', function () {
  console.log('file has been converted succesfully');
  bot.sendPhoto(CHAT_ID, _path, {
    caption: 'Сегодня ничего не выросло.'
  }).then(function (data) {
    console.log(data);
  });
}).on('error', function (err) {
  console.log('an error happened: ' + err.message);
}) // save to file
.save(_path);