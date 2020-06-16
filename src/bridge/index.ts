//import logger from '../logger';
import ModbusRTU from 'modbus-serial';
import {getEnv} from "../utils/getEnv";

const client = new ModbusRTU();

client.connectRTUBuffered(getEnv('MODBUS_PORT'), { baudRate: +getEnv('MODBUS_SPEED') });
client.setTimeout(1000);

interface ModbusCMD {
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
        length: Array<boolean>
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

async function executeCmd(command: ModbusCMD): Promise<void> {
    const cmd = command.command;

    client[cmd.cmd](cmd.dataAddress, cmd.values);
}