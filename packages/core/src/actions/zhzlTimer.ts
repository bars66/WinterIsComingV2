import {AbstractAction} from './abstract';
import {CronJob} from 'cron';

import type {Zhlz} from '../controllers/zhlz';
import type {Context} from '../context';

// TODO: Писать в базу о выполненном экшене. Или хотя бы в кибану. Но лучше в базу. Для истории...
// TODO: Сделать просто универсальный TimerAction
// Или Вообще универсальный action
// Пока кажется нужен только TimerAction
export class ZhzlTimerAction extends AbstractAction {
  private controller: Zhlz;

  // TODO: Вынести в мускуль
  settings = [
    {
      time: '00 00 10 * * *',
      action: 'open',
    },
    {
      time: '00 00 00 * * *',
      action: 'close',
    },
  ];

  jobs: Array<CronJob>;

  constructor({controller, context, name}: {controller: Zhlz; context: Context; name: string}) {
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
    this.stop();
    this.settings.forEach((setting) => {
      this.setJob(setting);
    });
  }

  public start() {
    this.setActions();
    this.jobs.forEach((job) => job.start());
  }

  public stop() {
    this.jobs.forEach((job) => job.stop());
    this.jobs = [];
  }
}
