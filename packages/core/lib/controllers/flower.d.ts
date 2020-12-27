import {AbstractController} from './abstract';
import type {Context} from '../context';
import type {Bridge} from '../bridges/bridge';
export declare type Statuses = {
  sensors: Array<number>;
  pumps: Array<number>;
  currentChannel: number;
  lastPump: number;
};
export declare class Flower extends AbstractController {
  static STATUS_DEVICE_ERROR: string;
  static DEFAULT_SETTINGS: {};
  private statuses;
  private bridge;
  private clientId;
  constructor(id: string, context: Context, bridge: Bridge, clientId: number);
  protected fetchStatus(): Promise<string>;
  protected _executeAction(action: string, params?: string): Promise<void>;
  getStatuses(): Statuses;
}
