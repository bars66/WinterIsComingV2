import {AbstractAction} from './abstract';
import {CronJob} from 'cron';
import type {Zhlz} from '../controllers/zhlz';
import type {Context} from '../context';
export declare class ZhzlTimerAction extends AbstractAction {
  private controller;
  settings: {
    time: string;
    action: string;
  }[];
  jobs: Array<CronJob>;
  constructor({controller, context, name}: {controller: Zhlz; context: Context; name: string});
  private setJob;
  private setActions;
  start(): void;
  stop(): void;
}
