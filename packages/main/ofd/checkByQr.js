import rp from 'request-promise';
import qs from 'qs';
import {getQrData} from './qrDecode';
import fs from 'fs';
// По мотивам https://habr.com/ru/post/358966/

export function decodeDate(s) {
  const [date, time] = s.split('T');
  return `${date[0]}${date[1]}${date[2]}${date[3]}-${date[4]}${date[5]}-${date[6]}${date[7]}T${time[0]}${time[1]}:${time[2]}${time[3]}`;
}

export function decodeQr(dataFromQr) {
  const parse = qs.parse(dataFromQr);
  console.log(dataFromQr);
  return {
    time: decodeDate(parse.t),
    type: parse.n, // 1 - приход, 2 - возврат прихода
    fiscalSign: parse.fp,
    fiscalNumber: parse.fn,
    fiscalDocument: parse.i,
    amount: parse.s.replace('.', ''),
  };
}

function getCheckCheckUrl(stringFromQr) {
  const decoded = decodeQr(stringFromQr);

  return `https://proverkacheka.nalog.ru:9999/v1/ofds/*/inns/*/fss/${decoded.fiscalNumber}/operations/${decoded.type}/tickets/${decoded.fiscalDocument}?fiscalSign=${decoded.fiscalSign}&date=${decoded.time}&sum=${decoded.amount}`;
}

function getCheckUrl(stringFromQr) {
  const decoded = decodeQr(stringFromQr);

  return `https://proverkacheka.nalog.ru:9999/v1/inns/*/kkts/*/fss/${decoded.fiscalNumber}/tickets/${decoded.fiscalDocument}?fiscalSign=${decoded.fiscalSign}&sendToEmail=no`;
}

async function checkCheck(stringFromQr) {
  const url = getCheckCheckUrl(stringFromQr);
  const res = await rp.get(url);

  var options = {
    uri: getCheckUrl(stringFromQr),
    method: 'GET',
    headers: {
      'Device-Id': '',
      'Device-Os': '',
    },
    auth: {
      user: '+79259163789',
      pass: '502958',
    },
  };
  try {
    const result = await rp(options);
    console.log(options, result);
  } catch (e) {
    console.log(options, e);
  }
}
// Relative path of the PDF file.
var pdfURL = __dirname + '/../../ofd.pdf';

getQrData(fs.readFileSync(pdfURL)).then((res) =>
  checkCheck(res).then(() => {
    console.log('Done');
  })
);
