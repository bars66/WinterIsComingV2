import {AbstractController} from './abstract';
import type {Context} from '../context';
import type {Bridge} from '../bridges/bridge';
export declare class Zhlz extends AbstractController {
  static STATUS_DEVICE_ERROR: string;
  static DEFAULT_SETTINGS: {
    minPosition: number[];
    maxPosition: number[];
    currentPosition: number[];
    inverted: boolean[];
  };
  private bridge;
  private clientId;
  private settings;
  constructor(id: string, context: Context, bridge: Bridge, clientId: number);
  protected fetchStatus(): Promise<string>;
  getCmdValue(
    settings: typeof Zhlz.DEFAULT_SETTINGS,
    newPositions: Array<number>
  ): {
    cmd: Array<number>;
    currentPositions: Array<number>;
  };
  setPositions(newPositions: Array<number>): Promise<void>;
  close(): Promise<void>;
  open(): Promise<void>;
}
