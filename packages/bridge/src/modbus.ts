import ModbusRTU from 'modbus-serial';
import type {Logger} from "winteriscomingv2-common";

export interface ModbusCMD {
    clientId: number,
    retry: number,

    command: {
        cmd: 'readCoils'
        dataAddress: number,
        length: number
    } | {
        cmd: 'readDiscreteInputs'
        dataAddress: number,
        length: number
    } |{
        cmd: 'readHoldingRegisters'
        dataAddress: number,
        length: number
    } |{
        cmd: 'readInputRegisters'
        dataAddress: number,
        length: number
    } | {
        cmd: 'writeCoil'
        dataAddress: number,
        state: boolean
    } | {
        cmd: 'writeCoils'
        dataAddress: number,
        states: Array<boolean>
    } | {
        cmd: 'writeRegister'
        dataAddress: number,
        value: number
    } | {
        cmd: 'writeRegisters'
        dataAddress: number,
        values: Array<number>
    },
}

const ALLOWED_COMMANDS = ['readCoils', 'readDiscreteInputs', 'readHoldingRegisters', 'readInputRegisters', 'writeCoil', 'writeCoils', 'writeRegister', 'writeRegisters'];

export class ModbusClient {
    static instance: ModbusClient;
    port: string;
    speed: number;
    client?: ModbusRTU;
    logger: Logger;

    constructor(port: string, speed: number, logger: Logger) {
        this.port = port;
        this.speed = speed;
        this.logger = logger;
    }

    static async getClient(port: string, speed: number, logger: Logger): Promise<ModbusClient> {
        if (ModbusClient.instance) return ModbusClient.instance;

        const client = new ModbusClient(port, speed, logger);
        await client.init();

        ModbusClient.instance = client;
        return client;
    }

    async init() {
        try {
            const client = new ModbusRTU();
            await client.connectRTUBuffered(this.port, { baudRate: this.speed });
            client.setTimeout(700);

            this.client = client;
        } catch (e) {
            this.logger.error({error: e}, 'Modbus client start failed');
        }
    }

    async executeCommand(command: ModbusCMD) {
        if (!ALLOWED_COMMANDS.includes(command.command.cmd)) {
            this.logger.error({command}, 'Incorrect command');
            return {time: Date.now(), error: 'Incorrect command'};
        }

        const client = this.client;
        if (!client) throw new Error('Use uninitialized client');
        client.setID(command.clientId);
        let retryCount = command.retry;
        if (retryCount === -1) {
            retryCount = 100;
        }

        let lastError;

        for (let i = 0; i !== retryCount; ++i) {
            try {
                let res = {};

                switch (command.command.cmd) {
                    case 'readCoils':
                        res = {answer: (await client.readCoils(command.command.dataAddress, command.command.length)).data};
                        break;
                    case 'readDiscreteInputs':
                        res = {answer: (await client.readDiscreteInputs(command.command.dataAddress, command.command.length)).data};
                        break;
                    case 'readHoldingRegisters':
                        res = {answer: (await client.readHoldingRegisters(command.command.dataAddress, command.command.length)).data};
                        break;
                    case 'readInputRegisters':
                        res = {answer: (await client.readInputRegisters(command.command.dataAddress, command.command.length)).data};
                        break;
                    case 'writeCoil':
                        res = {answer: (await client.writeCoil(command.command.dataAddress, command.command.state))};
                        break;
                    case 'writeCoils':
                        res = {answer: (await client.writeCoils(command.command.dataAddress, command.command.states))};
                        break;
                    case 'writeRegister':
                        res = {answer: (await client.writeRegister(command.command.dataAddress, command.command.value))};
                        break;
                    case 'writeRegisters':
                        res = {answer: (await client.writeRegisters(command.command.dataAddress, command.command.values))};
                        break;
                }

                return res;
            } catch (e) {
                this.logger.error({error: e, command, retryAttempt: i}, 'Execute command fail');
                lastError = e;
            }
        }

        return {time: Date.now(), error: lastError.message};
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.client) this.client.close((error?: Error) => {
                if (error) reject(error);
                return resolve();
            });
        })
    }
}