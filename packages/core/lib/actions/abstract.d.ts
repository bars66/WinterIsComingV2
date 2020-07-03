import type {Context} from '../context';
import type {Logger} from 'winteriscomingv2-common';
export declare class AbstractAction<T = any> {
  protected name: string;
  protected logger: Logger;
  protected settings: Array<T>;
  private settingsFromSql?;
  private sqlSettings;
  private isActive;
  constructor({name, context}: {name: string; context: Context});
  reloadSettings(): Promise<void>;
  setSettings(settings: Array<T>): Promise<void>;
  init(): Promise<void>;
  protected _start(): void;
  protected _stop(): void;
  start(): void;
  stop(): void;
}
