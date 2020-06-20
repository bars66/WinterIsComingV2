import type {Context} from '../context';
import type {ModbusCMD, ModbusAnswer} from 'winteriscomingv2-bridge/lib/types';

export const STATUS_MAX_TIME = 2000;

export class Bridge {
  context: Context;
  id: string;

  status: string = 'unavailable';
  watchTimeoutId?: NodeJS.Timeout = undefined;

  constructor(context: Context, id: string) {
    this.context = context;
    this.id = id;
  }

  resetBrifgeStatusTimeout(): void {
    if (this.watchTimeoutId) clearTimeout(this.watchTimeoutId);

    this.watchTimeoutId = setTimeout(() => {
      this.status = 'unavailable';
      this.context.logger.error({id: this.id}, 'Bridge unavailabe');
    }, STATUS_MAX_TIME);
  }

  init() {}

  static async start(context: Context, id: string): Promise<Bridge> {
    const bridge = new Bridge(context, id);
    await bridge.init();

    return bridge;
  }

  async send(cmd: ModbusCMD): Promise<void> {}
}
