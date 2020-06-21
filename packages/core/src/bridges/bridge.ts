import uuid from 'uuid';
import {BRIDGES_COMMAND_EXCHANGE, BRIDGES_STATUS_EXCHANGE, Logger} from 'winteriscomingv2-common';

import type {Context} from '../context';
import type {ModbusCMD, ModbusAnswer} from 'winteriscomingv2-bridge/lib/types';
import type {Channel} from 'amqplib';

export const STATUS_MAX_TIME = 2000;

export class Bridge {
  static STATUS_UNAVAILABLE = 'unavailable';
  static STATUS_READY = 'ready';
  static STATUS_CLOSED = 'closed';

  private context: Context;
  private id: string;
  private logger: Logger;

  private status: string = Bridge.STATUS_UNAVAILABLE;

  private lastStatusUpdate?: Date = undefined;
  private watchTimeoutId?: NodeJS.Timeout = undefined;
  private watchChannel?: Channel = undefined;

  constructor(context: Context, id: string) {
    this.context = context;
    this.logger = context.logger.child({bridge: {id}});
    this.id = id;
  }

  static async start(context: Context, id: string): Promise<Bridge> {
    const bridge = new Bridge(context, id);
    await bridge.init();

    return bridge;
  }

  private resetBridgeStatusTimeout(): void {
    if (this.watchTimeoutId) clearTimeout(this.watchTimeoutId);

    this.watchTimeoutId = setTimeout(() => {
      this.status = Bridge.STATUS_UNAVAILABLE;
      this.context.logger.error('Bridge unavailable');
    }, STATUS_MAX_TIME);
  }

  private async init(): Promise<void> {
    await this.watchStatus();
  }

  async close(): Promise<void> {
    if (this.watchChannel) await this.watchChannel.close();
    if (this.watchTimeoutId) clearTimeout(this.watchTimeoutId);
    this.status = Bridge.STATUS_CLOSED;
  }

  private async watchStatus() {
    this.watchChannel = await this.context.sources.rabbit.createChannel();
    await this.watchChannel.assertExchange(BRIDGES_STATUS_EXCHANGE, 'direct', {
      durable: false,
    });

    const q = await this.watchChannel.assertQueue('');

    await this.watchChannel.bindQueue(q.queue, BRIDGES_STATUS_EXCHANGE, `bridge.${this.id}`);

    await this.watchChannel.consume(
      q.queue,
      async (msg) => {
        if (!msg) {
          this.logger.error('Empty status message');
          return;
        }
        const status = JSON.parse(msg.content.toString());
        this.logger.trace({status}, 'Get status from bridge');
        this.lastStatusUpdate = new Date(status.date);

        if (status.status === 'ok') {
          if (this.status !== Bridge.STATUS_READY) {
            this.logger.info('Bridge available');
          }
          this.status = Bridge.STATUS_READY;
          this.resetBridgeStatusTimeout();
        }
      },
      {noAck: true}
    );
  }

  public execute(command: ModbusCMD): Promise<ModbusAnswer> {
    if (this.status === Bridge.STATUS_UNAVAILABLE) {
      throw new Error('Bridge unavailable');
    }

    return new Promise(async (resolve, reject) => {
      const channel = await this.context.sources.rabbit.createChannel();
      await channel.assertExchange(BRIDGES_COMMAND_EXCHANGE, 'direct', {
        durable: false,
      });

      const q = await channel.assertQueue('', {
        exclusive: true,
        autoDelete: true,
      });

      const correlationId = uuid.v4();

      await channel.consume(
        q.queue,
        async (msg) => {
          if (!msg) {
            this.context.logger.error('Empty msg');
            await channel.close();
            return reject(new Error('Empty message from bridge'));
          }

          if (msg.properties.correlationId === correlationId) {
            await channel.close();
            resolve(JSON.parse(msg.content.toString()));
          }
        },
        {noAck: true}
      );

      await channel.publish(
        BRIDGES_COMMAND_EXCHANGE,
        `bridge.${this.id}`,
        Buffer.from(JSON.stringify(command)),
        {
          correlationId: correlationId,
          replyTo: q.queue,
        }
      );
    });
  }
}
