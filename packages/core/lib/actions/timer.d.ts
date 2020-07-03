import {AbstractAction} from './abstract';
import {CronJob} from 'cron';
import type {Context} from '../context';
import type {AbstractController} from '../controllers/abstract';
declare type Settings = {
  time: string;
  action: string;
};
export declare class TimerAction extends AbstractAction<Settings> {
  private controller;
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
  protected _start(): void;
  protected _stop(): void;
}
export {};
