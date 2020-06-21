import {Logger} from 'winteriscomingv2-common';
import {Connection} from 'amqplib';
import {Pool} from 'mysql2/promise';
export declare type Sources = {
  rabbit: Connection;
  sql: Pool;
};
export declare type Context = {
  sources: Sources;
  logger: Logger;
};
export declare function createContext(): Promise<Context>;
export declare function closeSources(sources: Sources): Promise<void>;
