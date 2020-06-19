import Stream from 'node-rtsp-stream'
const RTSP = process.env.RTSP

export class Camera {
  name = 'controllers/Camera';

  params = {
  };

  stream;

  constructor (context) {
    this.logger = context.logger
    this.context = context

    this.context.controllers.Camera = this
    this.logger.debug('controllers/Camera started')
  }

  start() {
    if (this.stream) return;
    this.stream = new Stream({
      name: 'name',
      streamUrl: RTSP,
      wsPort: 9999,
      ffmpegOptions: { // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-r': 30 // options with required values specify the value after the key
      }
    })
  }

  stop() {
    if (this.stream) this.stream.stop();
  }
}
