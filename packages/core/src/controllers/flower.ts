import {AbstractController} from './abstract';
import type {Context} from '../context';
import type {Bridge} from '../bridges/bridge';
import {SqlSettings} from '../utilities/sqlSettings';
import {retry} from '../utilities/retry';
import type {Action} from './abstract';

export type Statuses = {
  sensors: Array<number>;
  pumps: Array<number>;
  currentChannel: number;
  lastPump: number;
};

export class Flower extends AbstractController {
  static STATUS_DEVICE_ERROR = 'device_error';
  static DEFAULT_SETTINGS = {};

  private statuses: Array<number> = [];
  private bridge: Bridge;
  private clientId: number;
  // private settings: SqlSettings<typeof Zhlz.DEFAULT_SETTINGS>;

  // protected actions: Array<Action> = [
  //   {
  //     type: "button",
  //     action: "close",
  //   }, {
  //     type: "button",
  //     action: "open",
  //   }
  // ]

  constructor(id: string, context: Context, bridge: Bridge, clientId: number) {
    super(id, context, 'Flower controller');

    this.bridge = bridge;
    this.clientId = clientId;
    // this.settings = new SqlSettings<typeof Zhlz.DEFAULT_SETTINGS>(
    //   context,
    //   `${this.name}_${this.id}`,
    //   Zhlz.DEFAULT_SETTINGS
    // );
  }

  protected async fetchStatus(): Promise<string> {
    const answer = await this.bridge.execute({
      clientId: this.clientId,
      retry: 1,

      command: {
        cmd: 'readHoldingRegisters',
        dataAddress: 0,
        length: 16,
      },
    });

    this.logger.trace({answer}, 'Get status from device');

    if (answer.error) {
      this.logger.error({error: answer.error}, 'Error from device');

      return Flower.STATUS_DEVICE_ERROR;
    }

    if (!!answer.answer) {
      if (answer.answer.cmd === 'readHoldingRegisters') {
        this.statuses = answer.answer.data;
      }

      return Flower.STATUS_AVAILABLE;
    }

    return Flower.STATUS_UNAVAILABLE;
  }

  // async runPump(value: Array<number>): Promise<void> {
  //   try {
  //     await this.bridge.execute({
  //       clientId: 10,
  //       retry: -1,
  //
  //       command: {
  //         cmd: 'writeRegisters',
  //         dataAddress: 0,
  //         values: newValues.cmd.map((value) => (value === 0 ? 0 : value + (1 << 15))),
  //       },
  //     });
  //   } catch (e) {
  //     this.logger.error({error: e, settings, newPositions}, `Can't change position`);
  //     return;
  //   }
  //
  //   settings.settings.currentPosition = newValues.currentPositions;
  //
  //   try {
  //     const fn = async () => {
  //       await this.settings.write(settings.settings, settings.updateId, true);
  //     };
  //
  //     await retry(fn, {attempts: 5});
  //   } catch (e) {
  //     this.logger.fatal({error: e, settings, newPositions}, `Can't change settings`);
  //   }
  // }

  // private async changeAllPosition(newValue: number): Promise<void> {
  //   const settings = await this.settings.getSettings();
  //   await this.setPositions(settings.settings.currentPosition.map((_) => newValue));
  // }
  //
  // private async moveAllByPercent(value: number): Promise<void> {
  //   const settings = await this.settings.getSettings();
  //
  //   const newValues = settings.settings.maxPosition.map((_, i) => {
  //     return  Math.round(((settings.settings.maxPosition[i] - settings.settings.minPosition[i]) / 100) * value);
  //   });
  //   await this.setPositions(newValues);
  // }

  protected async _executeAction(action: string, params?: string): Promise<void> {
    switch (action) {
      case 'runPump': {
        const config = JSON.parse(params || '');

        try {
          const values = [0, 0, 0, 0, 0, 0, 0];
          values[config.channel] = config.value;
          console.log({
            cmd: 'writeRegisters',
            dataAddress: 0,
            values: values,
          });
          await this.bridge.execute({
            clientId: this.clientId,
            retry: 1,

            command: {
              cmd: 'writeRegisters',
              dataAddress: 0,
              values: values,
            },
          });
          return;
        } catch (e) {
          this.logger.error({error: e, action, params}, `Can't run pump`);
          throw e;
        }
      }
    }

    throw new Error('Unknown action ' + action);
  }

  // public async getPosition(): Promise<Array<number>> {
  //   return (await this.settings.getSettings()).settings.currentPosition;
  // }
  //
  // public getMotorsStatus(): Array<string> {
  //   return this.motorsStatus.map(value => {
  //     switch (value) {
  //       case 0: return 'idle';
  //       case 1: return 'prepared';
  //       case 2: return 'run';
  //       case 3: return 'wait_for_finish';
  //     }
  //
  //     return 'unknown';
  //   })
  // }

  public getStatuses(): Statuses {
    return {
      sensors: this.statuses.slice(0, 7),
      pumps: this.statuses.slice(7, 14),
      currentChannel: this.statuses[14],
      lastPump: this.statuses[15],
    };
  }
}
