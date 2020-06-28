import {Logger} from 'winteriscomingv2-common';
import {Connection} from 'amqplib';
import {Pool} from 'mysql2/promise';
import {Timer} from './utilities/timer';
export declare type Sources = {
  rabbit: Connection;
  sql: Pool;
};
export declare type Context = {
  sources: Sources;
  logger: Logger;
  timer: Timer;
};
export declare function createContext(): Promise<Context>;
export declare function closeSources(sources: Sources): Promise<void>;
