"use strict";

require('dotenv').config();

const fs = require('fs');

const path = require('path');

const TelegramBot = require('node-telegram-bot-api'); // const Twitter = require('twitter');


const bot = new TelegramBot(process.env.TG_BOT, {
  polling: false
});

const ffmpeg = require('fluent-ffmpeg');

const RTSP = process.env.RTSP;
const CHAT_ID = process.env.TG_FLOWER_CHANNEL;

const _path = path.resolve(__dirname, './flowers.jpg');

const _pathText = path.resolve(__dirname, './text.txt');

const defaultText = 'Сегодня ничего не выросло.'; // const client = new Twitter({
//   consumer_key: process.env.TWITTER_CONSUMER_KEY,
//   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//   access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
// });

command = ffmpeg(RTSP).frames(1).on('end', function () {
  console.log('file has been converted succesfully');
  const file = fs.readFileSync(_path);
  let text = defaultText;

  try {
    text = fs.readFileSync(_pathText);
  } catch (e) {}

  fs.writeFileSync(_pathText, defaultText);
  bot.sendPhoto(CHAT_ID, file, {
    caption: text,
    disable_notification: true
  }).then(function (data) {
    console.log(data);
  }); // client.post('media/upload', {media: file}, function(error, media, response) {
  //   if (!error) {
  //
  //     // If successful, a media object will be returned.
  //     console.log(media);
  //
  //     // Lets tweet it
  //     var status = {
  //       status: 'Сегодня ничего не выросло.',
  //       media_ids: media.media_id_string // Pass the media id string
  //     }
  //
  //     client.post('statuses/update', status, function(error, tweet, response) {
  //       if (!error) {
  //         console.log(tweet);
  //       }
  //     });
  //
  //   }
  // });
}).on('error', function (err) {
  console.log('an error happened: ' + err.message);
}) // save to file
.save(_path);