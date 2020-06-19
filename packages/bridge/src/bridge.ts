import amqplib from "amqplib";
import {BRIDGES_COMMAND_EXCHANGE, BRIDGES_STATUS_EXCHANGE, Logger} from "winteriscomingv2-common";
import {ModbusClient} from "./modbus";

import type {Connection, Channel} from "amqplib";
import type {ModbusCMD} from "./modbus";


export class Bridge {
    id: string;
    connection?: Connection;
    logger: Logger;
    modbusClient?: ModbusClient;

    intervalId?: NodeJS.Timeout;
    watchChannel?: Channel;

    constructor(id: string, logger: Logger) {
        this.id = id;
        this.logger = logger;
    }

    static async init(conf: {rabbitHost: string, id: string, logger: Logger, port: string, speed: number}) {
        const bridge = new Bridge(conf.id, conf.logger)
        bridge.connection = await amqplib.connect(conf.rabbitHost);
        bridge.modbusClient = await ModbusClient.getClient(conf.port, conf.speed, conf.logger);
        conf.logger.info('Bridge init');

        await bridge.watch();
        conf.logger.info('Bridge watcher start');

        await bridge.bridgeStatusSender();
        conf.logger.info('Bridge status sender start');

        return bridge;
    }

    async bridgeStatusSender() {
        if (!this.connection) throw new Error('Connection must be exists');
        const channel = await this.connection.createChannel();
        await channel.assertExchange(BRIDGES_STATUS_EXCHANGE, 'direct', {durable: false});

        this.intervalId = setInterval(async () => {
            await channel.publish(BRIDGES_STATUS_EXCHANGE, `bridge.${this.id}`, Buffer.from(JSON.stringify({
                status: 'ok',
                time: new Date(),
            })), {expiration: 2000});
        }, 1000)
    }

    async watch() {
        if (!this.connection) throw new Error('Connection must be exists');
        const modbusClient = this.modbusClient;
        if (!modbusClient) throw new Error('Modbus client must be exists');

        const channel = await this.connection.createChannel();
        await channel.assertExchange(BRIDGES_COMMAND_EXCHANGE, 'direct', {durable: false});
        await channel.prefetch(1);
        const q = await  channel.assertQueue('', {
            exclusive: true
        });

        await channel.bindQueue(q.queue, BRIDGES_COMMAND_EXCHANGE, `bridge.${this.id}`);

        await channel.consume(q.queue, async (msg) => {
            if (!msg) {
                this.logger.error('Empty message');
                return;
            }
            const t0 = Date.now();

            const command: ModbusCMD = JSON.parse(msg.content.toString());

            const result = await modbusClient.executeCommand(command);

            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(result)),
                {
                    correlationId: msg.properties.correlationId
                }
            );

            channel.ack(msg);
            this.logger.debug({
                command,
                result,
                time: Date.now() - t0,
            }, 'Command execute');
        });

        this.watchChannel = channel;
    }

    async close() {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.watchChannel) await this.watchChannel.close();
        if (this.connection) await this.connection.close();
        if (this.modbusClient) await this.modbusClient.close();

        this.logger.info('Bridge stopped');
    }
}
