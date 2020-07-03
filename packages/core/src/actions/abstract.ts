import type {Context} from '../context';
import type {Logger} from 'winteriscomingv2-common';
import {SettingsFromSql, SqlSettings} from '../utilities/sqlSettings';

export class AbstractAction<T = any> {
  protected name: string;
  protected logger: Logger;
  protected settings: Array<T>;
  private settingsFromSql?: SettingsFromSql<Array<T>>;
  private sqlSettings: SqlSettings<Array<T>>;
  private isActive: boolean = false;

  constructor({name, context}: {name: string; context: Context}) {
    this.name = name;
    this.logger = context.logger.child({action: {name: this.name}});
    this.settings = [];
    this.sqlSettings = new SqlSettings(context, name, this.settings);
  }

  public async reloadSettings(): Promise<void> {
    const isActive = this.isActive;
    this.stop();
    this.settingsFromSql = await this.sqlSettings.getSettings();
    this.settings = this.settingsFromSql.settings;
    if (isActive) this.start();
  }

  public async setSettings(settings: Array<T>): Promise<void> {
    await this.sqlSettings.write(settings, this.settingsFromSql?.updateId || 0);
  }

  public async init() {
    await this.reloadSettings();
    this.start();
  }

  protected _start() {
    throw new Error('Not implemented');
  }

  protected _stop() {
    throw new Error('Not implemented');
  }

  public start() {
    this.logger.info('Start action');
    this.isActive = true;
    this._start();
  }

  public stop() {
    this.logger.info('Stop action');
    this.isActive = false;
    this._stop();
  }
}
