/// <reference types="node" />
import {Logger} from 'winteriscomingv2-common';
import {ModbusClient} from './modbus';
import type {Connection, Channel} from 'amqplib';
export declare class Bridge {
  id: string;
  connection?: Connection;
  logger: Logger;
  modbusClient?: ModbusClient;
  intervalId?: NodeJS.Timeout;
  watchChannel?: Channel;
  constructor(id: string, logger: Logger);
  static init(conf: {
    rabbitHost: string;
    id: string;
    logger: Logger;
    port: string;
    speed: number;
  }): Promise<Bridge>;
  bridgeStatusSender(): Promise<void>;
  watch(): Promise<void>;
  close(): Promise<void>;
}
