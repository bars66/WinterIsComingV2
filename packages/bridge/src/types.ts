import {
  ReadCoilResult,
  ReadRegisterResult,
  WriteCoilResult,
  WriteMultipleResult,
  WriteRegisterResult,
} from 'modbus-serial/ModbusRTU';

export type ModbusCMD = {
  clientId: number;
  retry: number;

  command:
    | {
        cmd: 'readCoils';
        dataAddress: number;
        length: number;
      }
    | {
        cmd: 'readDiscreteInputs';
        dataAddress: number;
        length: number;
      }
    | {
        cmd: 'readHoldingRegisters';
        dataAddress: number;
        length: number;
      }
    | {
        cmd: 'readInputRegisters';
        dataAddress: number;
        length: number;
      }
    | {
        cmd: 'writeCoil';
        dataAddress: number;
        state: boolean;
      }
    | {
        cmd: 'writeCoils';
        dataAddress: number;
        states: Array<boolean>;
      }
    | {
        cmd: 'writeRegister';
        dataAddress: number;
        value: number;
      }
    | {
        cmd: 'writeRegisters';
        dataAddress: number;
        values: Array<number>;
      };
};
export type ModbusClientAnswer =
  | ({
      cmd: 'readCoils';
    } & ReadCoilResult)
  | ({
      cmd: 'readDiscreteInputs';
    } & ReadCoilResult)
  | ({
      cmd: 'readHoldingRegisters';
    } & ReadRegisterResult)
  | ({
      cmd: 'readInputRegisters';
    } & ReadRegisterResult)
  | ({
      cmd: 'writeCoil';
    } & WriteCoilResult)
  | ({
      cmd: 'writeCoils';
    } & WriteMultipleResult)
  | ({
      cmd: 'writeRegister';
    } & WriteRegisterResult)
  | ({
      cmd: 'writeRegisters';
    } & WriteMultipleResult);
export type ModbusAnswer = {
  time: number;
  answer?: ModbusClientAnswer;
  error?: string;
};
