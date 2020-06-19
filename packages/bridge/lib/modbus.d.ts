import ModbusRTU from 'modbus-serial';
import type { Logger } from "winteriscomingv2-common";
export interface ModbusCMD {
    clientId: number;
    retry: number;
    command: {
        cmd: 'readCoils';
        dataAddress: number;
        length: number;
    } | {
        cmd: 'readDiscreteInputs';
        dataAddress: number;
        length: number;
    } | {
        cmd: 'readHoldingRegisters';
        dataAddress: number;
        length: number;
    } | {
        cmd: 'readInputRegisters';
        dataAddress: number;
        length: number;
    } | {
        cmd: 'writeCoil';
        dataAddress: number;
        state: boolean;
    } | {
        cmd: 'writeCoils';
        dataAddress: number;
        states: Array<boolean>;
    } | {
        cmd: 'writeRegister';
        dataAddress: number;
        value: number;
    } | {
        cmd: 'writeRegisters';
        dataAddress: number;
        values: Array<number>;
    };
}
export declare class ModbusClient {
    static instance: ModbusClient;
    port: string;
    speed: number;
    client?: ModbusRTU;
    logger: Logger;
    constructor(port: string, speed: number, logger: Logger);
    static getClient(port: string, speed: number, logger: Logger): Promise<ModbusClient>;
    init(): Promise<void>;
    executeCommand(command: ModbusCMD): Promise<{}>;
    close(): Promise<unknown>;
}
