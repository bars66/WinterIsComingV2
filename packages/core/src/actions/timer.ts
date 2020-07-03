import {AbstractAction} from './abstract';
import {CronJob} from 'cron';

import type {Zhlz} from '../controllers/zhlz';
import type {Context} from '../context';
import type {AbstractController} from '../controllers/abstract';

type Settings = {
  time: string;
  action: string;
};

// TODO: Писать в базу о выполненном экшене. Или хотя бы в кибану. Но лучше в базу. Для истории...
export class TimerAction extends AbstractAction<Settings> {
  private controller: AbstractController;

  jobs: Array<CronJob>;

  constructor({
    controller,
    context,
    name,
  }: {
    controller: AbstractController;
    context: Context;
    name: string;
  }) {
    super({name, context});

    this.controller = controller;
    this.jobs = [];
  }

  private setJob(setting: {time: string; action: string}) {
    this.logger.info({actionParams: setting}, 'Set action');
    const job = new CronJob(
      setting.time,
      async () => {
        try {
          await this.controller.executeAction(setting.action);
          this.logger.info({actionParams: setting, author: this.name}, 'Action success');
        } catch (e) {
          this.logger.error({error: e, actionParams: setting, author: this.name}, 'Action failed');
        }
      },
      null,
      true,
      'Europe/Moscow'
    );
    this.jobs.push(job);
  }

  private setActions() {
    this._stop();
    this.settings.forEach((setting) => {
      this.setJob(setting);
    });
  }

  protected _start() {
    this.setActions();
    this.jobs.forEach((job) => job.start());
  }

  protected _stop() {
    this.jobs.forEach((job) => job.stop());
    this.jobs = [];
  }
}
