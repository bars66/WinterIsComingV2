import EventEmitter from 'events';

export class Timer extends EventEmitter {
  private timerIntervalIdSecond?: NodeJS.Timeout;
  private timerIntervalIdMinute?: NodeJS.Timeout;

  private oneSecondMs: number = 1000;

  constructor() {
    super();
  }

  private timer(id: string) {
    this.emit(id, Date.now());
  }

  run() {
    this.timerIntervalIdSecond = setInterval(() => {
      this.timer('second');
    }, this.oneSecondMs);

    this.timerIntervalIdMinute = setInterval(() => {
      this.timer('minute');
    }, 60 * this.oneSecondMs);
  }

  stop() {
    if (this.timerIntervalIdSecond) clearInterval(this.timerIntervalIdSecond);
    if (this.timerIntervalIdMinute) clearInterval(this.timerIntervalIdMinute);
  }
}
