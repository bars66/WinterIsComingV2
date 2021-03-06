import {AbstractAction} from './abstract';
import {CronJob} from 'cron';
import type {Context} from '../context';
import type {AbstractController} from '../controllers/abstract';
export declare class TimerAction extends AbstractAction {
  private controller;
  settings: {
    time: string;
    action: string;
  }[];
  jobs: Array<CronJob>;
  constructor({
    controller,
    context,
    name,
  }: {
    controller: AbstractController;
    context: Context;
    name: string;
  });
  private setJob;
  private setActions;
  start(): void;
  stop(): void;
}
