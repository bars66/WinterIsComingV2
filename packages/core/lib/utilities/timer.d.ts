/// <reference types="node" />
import EventEmitter from 'events';
export declare class Timer extends EventEmitter {
  private timerIntervalIdSecond?;
  private timerIntervalIdMinute?;
  private oneSecondMs;
  constructor();
  private timer;
  run(): void;
  stop(): void;
}
