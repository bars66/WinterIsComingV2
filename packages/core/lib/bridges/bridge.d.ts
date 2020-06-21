import type {Context} from '../context';
import type {ModbusCMD, ModbusAnswer} from 'winteriscomingv2-bridge/lib/types';
export declare const STATUS_MAX_TIME = 2000;
export declare class Bridge {
  static STATUS_UNAVAILABLE: string;
  static STATUS_READY: string;
  static STATUS_CLOSED: string;
  private context;
  private id;
  private logger;
  private status;
  private lastStatusUpdate?;
  private watchTimeoutId?;
  private watchChannel?;
  constructor(context: Context, id: string);
  static start(context: Context, id: string): Promise<Bridge>;
  private resetBridgeStatusTimeout;
  private init;
  close(): Promise<void>;
  private watchStatus;
  execute(command: ModbusCMD): Promise<ModbusAnswer>;
}
