import ModbusRTU from 'modbus-serial';
import type {ModbusAnswer, ModbusCMD} from './types';
import type {Logger} from 'winteriscomingv2-common';
export declare class ModbusClient {
  static instance: ModbusClient;
  port: string;
  speed: number;
  client?: ModbusRTU;
  logger: Logger;
  constructor(port: string, speed: number, logger: Logger);
  static getClient(port: string, speed: number, logger: Logger): Promise<ModbusClient>;
  init(): Promise<void>;
  executeCommand(command: ModbusCMD): Promise<ModbusAnswer>;
  close(): Promise<void>;
}
