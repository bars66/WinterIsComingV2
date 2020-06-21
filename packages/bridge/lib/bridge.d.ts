import {Logger} from 'winteriscomingv2-common';
export declare class Bridge {
  private id;
  private connection?;
  private logger;
  private modbusClient?;
  private intervalId?;
  private watchChannel?;
  constructor(id: string, logger: Logger);
  static init(conf: {
    rabbitHost: string;
    id: string;
    logger: Logger;
    port: string;
    speed: number;
  }): Promise<Bridge>;
  private bridgeStatusSender;
  private watch;
  close(): Promise<void>;
}
