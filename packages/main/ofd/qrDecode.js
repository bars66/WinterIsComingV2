import QrCode from 'qrcode-reader';
import Jimp from 'jimp';
// import Canvas from 'canvas';
import fs from 'fs';
import assert from 'assert';
// import pdfjsLib from 'pdfjs-dist';
// import jsQR from "jsqr";

// По мотивам - https://github.com/mozilla/pdf.js/tree/master/examples/node/pdf2png

class NodeCanvasFactory {
  create(width, height) {
    assert(width > 0 && height > 0, 'Invalid canvas size');
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context,
    };
  }

  reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');
    assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

export function getQrCodeDataByBuffer(buff, width, height) {
  return new Promise(async (resolve, reject) => {
    const image = await Jimp.read(buff);
    const code = jsQR(image.bitmap.data, width, height);
    if (code && code.data) return resolve({result: code.data});

    var qr = new QrCode();
    qr.callback = function (err, value) {
      if (err) {
        reject(err);
      }
      return resolve(value);
    };
    qr.decode(image.bitmap);
  });
}

export async function getQrData(buff) {
  // Read the PDF file into a typed array so PDF.js can load it.
  const rawData = new Uint8Array(buff);
  const pdfDocument = await pdfjsLib.getDocument(rawData).promise;
  // Get the first page.

  let res;
  for (let i = pdfDocument.numPages; i !== 0; --i) {
    const page = await pdfDocument.getPage(i);
    // Render the page on a Node canvas with 100% scale.
    const viewport = page.getViewport({scale: 1});
    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport: viewport,
      canvasFactory: canvasFactory,
    };

    await page.render(renderContext).promise;
    const image = canvasAndContext.canvas.toBuffer();
    fs.writeFileSync(`${i}.png`, image);

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
