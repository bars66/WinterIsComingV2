import ModbusRTU from 'modbus-serial';
import type {ModbusAnswer, ModbusClientAnswer, ModbusCMD} from './types';
import type {Logger} from 'winteriscomingv2-common';

const ALLOWED_COMMANDS = [
  'readCoils',
  'readDiscreteInputs',
  'readHoldingRegisters',
  'readInputRegisters',
  'writeCoil',
  'writeCoils',
  'writeRegister',
  'writeRegisters',
];

const MAX_RETRIES = 10;

export class ModbusClient {
  static instance: ModbusClient;
  private port: string;
  private speed: number;
  private client?: ModbusRTU;
  private logger: Logger;

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

  private async init() {
    try {
      const client = new ModbusRTU();
      await client.connectRTUBuffered(this.port, {baudRate: this.speed});
      client.setTimeout(700);

      this.client = client;
    } catch (e) {
      this.logger.error({error: e}, 'Modbus client start failed');
    }
  }

  async executeCommand(command: ModbusCMD): Promise<ModbusAnswer> {
    if (!ALLOWED_COMMANDS.includes(command.command.cmd)) {
      this.logger.error({command}, 'Incorrect command');
      return {time: Date.now(), error: 'Incorrect command'};
    }

    const client = this.client;
    if (!client) throw new Error('Use uninitialized client');
    client.setID(command.clientId);
    let retryCount = command.retry;
    if (retryCount === -1) {
      retryCount = MAX_RETRIES;
    }
    retryCount = Math.min(retryCount, MAX_RETRIES);

    let lastError;

    for (let i = 0; i !== retryCount; ++i) {
      try {
        let res: ModbusClientAnswer;

        switch (command.command.cmd) {
          case 'readCoils':
            res = {
              cmd: 'readCoils',
              ...(await client.readCoils(command.command.dataAddress, command.command.length)),
            };
            break;
          case 'readDiscreteInputs':
            res = {
              cmd: 'readDiscreteInputs',
              ...(await client.readDiscreteInputs(
                command.command.dataAddress,
                command.command.length
              )),
            };
            break;
          case 'readHoldingRegisters':
            res = {
              cmd: 'readHoldingRegisters',
              ...(await client.readHoldingRegisters(
                command.command.dataAddress,
                command.command.length
              )),
            };
            break;
          case 'readInputRegisters':
            res = {
              cmd: 'readInputRegisters',
              ...(await client.readInputRegisters(
                command.command.dataAddress,
                command.command.length
              )),
            };
            break;
          case 'writeCoil':
            res = {
              cmd: 'writeCoil',
              ...(await client.writeCoil(command.command.dataAddress, command.command.state)),
            };
            break;
          case 'writeCoils':
            res = {
              cmd: 'writeCoils',
              ...(await client.writeCoils(command.command.dataAddress, command.command.states)),
            };
            break;
          case 'writeRegister':
            res = {
              cmd: 'writeRegister',
              ...(await client.writeRegister(command.command.dataAddress, command.command.value)),
            };
            break;
          case 'writeRegisters':
            res = {
              cmd: 'writeRegisters',
              ...(await client.writeRegisters(command.command.dataAddress, command.command.values)),
            };
            break;
        }

        return {time: Date.now(), answer: res};
      } catch (e) {
        this.logger.error({error: e, command, retryAttempt: i}, 'Execute command fail');
        lastError = e;
      }
    }

    return {time: Date.now(), error: lastError.message};
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client)
        this.client.close((error?: Error) => {
          if (error) reject(error);
          return resolve();
        });
    });
  }
}
