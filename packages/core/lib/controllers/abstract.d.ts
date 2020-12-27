/// <reference types="node" />
import EventEmitter from 'events';
import type {Context} from '../context';
import type {Logger} from 'winteriscomingv2-common';
export declare type Action = {
  type: 'button';
  action: string;
};
export declare class AbstractController extends EventEmitter {
  static CHANGE_STATUS_EVENT: string;
  static CHANGE_EVENT: string;
  static STATUS_NOT_INITIALIZED: string;
  static STATUS_UNAVAILABLE: string;
  static STATUS_AVAILABLE: string;
  name: string;
  protected context: Context;
  protected id: string;
  protected logger: Logger;
  protected statusFetchTimeout: number;
  private statusIntervalId?;
  private status;
  protected initWaitTimeout: number;
  protected actions: Array<Action>;
  constructor(id: string, context: Context, name: string);
  getId(): string;
  private checkStatus;
  protected setStatus(status: string): void;
  protected changed(): void;
  protected fetchStatus(): Promise<string>;
  protected _executeAction(action: string, params?: string): Promise<void>;
  executeAction(action: string, params?: string): Promise<void>;
  waitForInitDone(): Promise<void>;
  getActions(): Array<Action>;
}
