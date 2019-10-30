"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQrCodeDataByBuffer = getQrCodeDataByBuffer;
exports.getQrData = getQrData;

var _qrcodeReader = _interopRequireDefault(require("qrcode-reader"));

var _jimp = _interopRequireDefault(require("jimp"));

var _canvas = _interopRequireDefault(require("canvas"));

var _fs = _interopRequireDefault(require("fs"));

var _assert = _interopRequireDefault(require("assert"));

var _pdfjsDist = _interopRequireDefault(require("pdfjs-dist"));

var _jsqr = _interopRequireDefault(require("jsqr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// По мотивам - https://github.com/mozilla/pdf.js/tree/master/examples/node/pdf2png
class NodeCanvasFactory {
  create(width, height) {
    (0, _assert.default)(width > 0 && height > 0, 'Invalid canvas size');

    const canvas = _canvas.default.createCanvas(width, height);

    const context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context
    };
  }

  reset(canvasAndContext, width, height) {
    (0, _assert.default)(canvasAndContext.canvas, 'Canvas is not specified');
    (0, _assert.default)(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    (0, _assert.default)(canvasAndContext.canvas, 'Canvas is not specified'); // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.

    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }

}

function getQrCodeDataByBuffer(buff, width, height) {
  return new Promise(async (resolve, reject) => {
    const image = await _jimp.default.read(buff);
    const code = (0, _jsqr.default)(image.bitmap.data, width, height);
    if (code && code.data) return resolve({
      result: code.data
    });
    var qr = new _qrcodeReader.default();

    qr.callback = function (err, value) {
      if (err) {
        reject(err);
      }

      return resolve(value);
    };

    qr.decode(image.bitmap);
  });
}

async function getQrData(buff) {
  // Read the PDF file into a typed array so PDF.js can load it.
  const rawData = new Uint8Array(buff);
  const pdfDocument = await _pdfjsDist.default.getDocument(rawData).promise; // Get the first page.

  let res;

  for (let i = pdfDocument.numPages; i !== 0; --i) {
    const page = await pdfDocument.getPage(i); // Render the page on a Node canvas with 100% scale.

    const viewport = page.getViewport({
      scale: 1
    });
    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport: viewport,
      canvasFactory: canvasFactory
    };
    await page.render(renderContext).promise;
    const image = canvasAndContext.canvas.toBuffer();

    _fs.default.writeFileSync(`${i}.png`, image);

    canvasFactory.destroy(canvasAndContext);

    try {
      console.log('UUU', i);
      const decodedFromList = await getQrCodeDataByBuffer(image, viewport.width, viewport.height);
      console.log('decodedFromList', decodedFromList);
      if (decodedFromList && res) throw new Error('Два QR в документе');
      if (decodedFromList) res = decodedFromList;
    } catch (e) {
      console.log(e);
    }
  }

  return res ? res.result : undefined;
}