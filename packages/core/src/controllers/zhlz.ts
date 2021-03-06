import {AbstractController} from './abstract';
import type {Context} from '../context';
import type {Bridge} from '../bridges/bridge';
import {SqlSettings} from '../utilities/sqlSettings';
import {retry} from '../utilities/retry';
import type {Action} from './abstract';

export class Zhlz extends AbstractController {
  static STATUS_DEVICE_ERROR = 'device_error';
  static DEFAULT_SETTINGS = {
    minPosition: [0, 0, 0],
    maxPosition: [3520, 3520, 3520],
    currentPosition: [0, 0, 0],
    inverted: [true, false, false],
  };

  private motorsStatus: Array<number> = [];
  private bridge: Bridge;
  private clientId: number;
  private settings: SqlSettings<typeof Zhlz.DEFAULT_SETTINGS>;

  protected actions: Array<Action> = [
    {
      type: 'button',
      action: 'close',
    },
    {
      type: 'button',
      action: 'open',
    },
  ];

  constructor(id: string, context: Context, bridge: Bridge, clientId: number) {
    super(id, context, 'Zhlz controller');

    this.bridge = bridge;
    this.clientId = clientId;
    this.settings = new SqlSettings<typeof Zhlz.DEFAULT_SETTINGS>(
      context,
      `${this.name}_${this.id}`,
      Zhlz.DEFAULT_SETTINGS
    );
  }

  protected async fetchStatus(): Promise<string> {
    const answer = await this.bridge.execute({
      clientId: this.clientId,
      retry: 1,

      command: {
        cmd: 'readHoldingRegisters',
        dataAddress: 0,
        length: 3,
      },
    });

    this.logger.trace({answer}, 'Get status from device');

    if (answer.error) {
      this.logger.error({error: answer.error}, 'Error from device');

      return Zhlz.STATUS_DEVICE_ERROR;
    }

    if (!!answer.answer) {
      if (answer.answer.cmd === 'readHoldingRegisters') {
        this.motorsStatus = answer.answer.data;
      }

      return Zhlz.STATUS_AVAILABLE;
    }

    return Zhlz.STATUS_UNAVAILABLE;
  }

  private getCmdValue(
    settings: typeof Zhlz.DEFAULT_SETTINGS,
    newPositions: Array<number>
  ): {cmd: Array<number>; currentPositions: Array<number>} {
    let cmd = [];
    let currentPositions = [];

    if (newPositions.length !== settings.currentPosition.length) {
      throw new Error('Длинны не совпадают');
    }

    for (let i: number = 0; i !== newPositions.length; ++i) {
      const newPosition = newPositions[i];

      const isInverted = settings.inverted[i];
      const minPosition = settings.minPosition[i];
      const maxPosition = settings.maxPosition[i];
      const currentPosition = settings.currentPosition[i];

      if (newPosition == undefined || newPosition === currentPosition) {
        cmd.push(0);
        currentPositions.push(currentPosition);
        continue;
      }

      const position: number = Math.min(Math.max(newPosition, minPosition), maxPosition);
      const delta = position - currentPosition;

      cmd.push(delta * (isInverted ? -1 : 1));
      currentPositions.push(position);
    }

    return {cmd, currentPositions};
  }

  async setPositions(newPositions: Array<number>): Promise<void> {
    const settings = await this.settings.getSettings();
    const newValues = this.getCmdValue(settings.settings, newPositions);

    try {
      await this.bridge.execute({
        clientId: 10,
        retry: -1,

        command: {
          cmd: 'writeRegisters',
          dataAddress: 0,
          values: newValues.cmd.map((value) => (value === 0 ? 0 : value + (1 << 15))),
        },
      });
    } catch (e) {
      this.logger.error({error: e, settings, newPositions}, `Can't change position`);
      return;
    }

    settings.settings.currentPosition = newValues.currentPositions;

    try {
      const fn = async () => {
        await this.settings.write(settings.settings, settings.updateId, true);
      };

      await retry(fn, {attempts: 5});
    } catch (e) {
      this.logger.fatal({error: e, settings, newPositions}, `Can't change settings`);
    }
  }

  private async changeAllPosition(newValue: number): Promise<void> {
    const settings = await this.settings.getSettings();
    await this.setPositions(settings.settings.currentPosition.map((_) => newValue));
  }

  private async moveAllByPercent(value: number): Promise<void> {
    const settings = await this.settings.getSettings();

    const newValues = settings.settings.maxPosition.map((_, i) => {
      return Math.round(
        ((settings.settings.maxPosition[i] - settings.settings.minPosition[i]) / 100) * value
      );
    });
    await this.setPositions(newValues);
  }

  protected _executeAction(action: string, params?: string): Promise<void> {
    switch (action) {
      case 'open': {
        return this.changeAllPosition(+Infinity);
      }

      case 'close': {
        return this.changeAllPosition(-Infinity);
      }

      case 'moveAll': {
        return this.moveAllByPercent(Math.max(Math.min(+(params || 0), 100), 0));
      }
    }

    throw new Error('Unknown action ' + action);
  }

  public async getPosition(): Promise<Array<number>> {
    return (await this.settings.getSettings()).settings.currentPosition;
  }

  public getMotorsStatus(): Array<string> {
    return this.motorsStatus.map((value) => {
      switch (value) {
        case 0:
          return 'idle';
        case 1:
          return 'prepared';
        case 2:
          return 'run';
        case 3:
          return 'wait_for_finish';
      }

      return 'unknown';
    });
  }
}
