import {AbstractController} from './abstract';
import type {Context} from '../context';
import type {Bridge} from '../bridges/bridge';
import type {Action} from './abstract';
export declare class Zhlz extends AbstractController {
  static STATUS_DEVICE_ERROR: string;
  static DEFAULT_SETTINGS: {
    minPosition: number[];
    maxPosition: number[];
    currentPosition: number[];
    inverted: boolean[];
  };
  private motorsStatus;
  private bridge;
  private clientId;
  private settings;
  protected actions: Array<Action>;
  constructor(id: string, context: Context, bridge: Bridge, clientId: number);
  protected fetchStatus(): Promise<string>;
  private getCmdValue;
  setPositions(newPositions: Array<number>): Promise<void>;
  private changeAllPosition;
  private moveAllByPercent;
  protected _executeAction(action: string, params?: string): Promise<void>;
  getPosition(): Promise<Array<number>>;
  getMotorsStatus(): Array<string>;
}
