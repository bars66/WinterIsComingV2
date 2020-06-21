import type {ModbusAnswer, ModbusCMD} from './types';
import type {Logger} from 'winteriscomingv2-common';
export declare class ModbusClient {
  static instance: ModbusClient;
  private port;
  private speed;
  private client?;
  private logger;
  constructor(port: string, speed: number, logger: Logger);
  static getClient(port: string, speed: number, logger: Logger): Promise<ModbusClient>;
  private init;
  executeCommand(command: ModbusCMD): Promise<ModbusAnswer>;
  close(): Promise<void>;
}
