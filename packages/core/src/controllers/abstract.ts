import EventEmitter from 'events';
import type {Context} from '../context';
import type {Logger} from 'winteriscomingv2-common';
import {logger} from 'winteriscomingv2-common';

export class AbstractController extends EventEmitter {
  static CHANGE_STATUS_EVENT = 'changeStatus';
  static CHANGE_EVENT = 'changeStatus';
  static STATUS_NOT_INITIALIZED = 'notInitialized';
  static STATUS_UNAVAILABLE = 'unavailable';
  static STATUS_AVAILABLE = 'available';

  name: string = 'Abstract controller';
  protected context: Context;
  protected id: string;
  protected logger: Logger;
  protected statusFetchTimeout: number = 1000;
  private statusIntervalId?: NodeJS.Timeout;
  private status: string;
  protected initWaitTimeout: number = 5000;

  constructor(id: string, context: Context, name: string) {
    super();

    this.name = name;
    this.id = id;
    this.status = AbstractController.STATUS_NOT_INITIALIZED;
    this.context = context;
    this.logger = context.logger.child({controller: {id, name: this.name}});

    if (this.statusFetchTimeout > 0) {
      this.statusIntervalId = setInterval(async () => {
        this.checkStatus().catch((e) => logger.error({error: e}, 'Fetch status error'));
      }, this.statusFetchTimeout);
    }
  }

  private async checkStatus() {
    let status;
    try {
      status = await this.fetchStatus();
    } catch (e) {
      status = AbstractController.STATUS_UNAVAILABLE;
      this.logger.error({error: e}, 'Fetch status error');
    }

    this.setStatus(status);
  }

  protected setStatus(status: string): void {
    if (status !== this.status) {
      this.logger.info({from: this.status, to: status}, 'Change status');
      this.changed();
    }
    this.status = status;
    this.emit(AbstractController.CHANGE_STATUS_EVENT, status);
  }

  protected changed(): void {
    this.emit(AbstractController.CHANGE_EVENT);
  }

  protected async fetchStatus(): Promise<string> {
    throw new Error('not implemented');
  }

  waitForInitDone(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Init timeout'));
      }, this.initWaitTimeout);

      const changeListenerFn = () => {
        if (this.status !== AbstractController.STATUS_NOT_INITIALIZED) {
          this.removeListener(AbstractController.CHANGE_STATUS_EVENT, changeListenerFn);
          clearTimeout(timeoutId);
          resolve();
        }
      };

      this.on(AbstractController.CHANGE_STATUS_EVENT, changeListenerFn);
    });
  }
}
