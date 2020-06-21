import {Zhlz} from '../zhlz';

jest.unmock('../zhlz');
jest.unmock('../../utilities/retry');

// По сути любое кручение шаговым двигателем возможно, не только жаллюзи
describe('Привод управления жаллюзи', () => {
  let sut;

  beforeEach(() => {
    sut = new Zhlz();
  });

  describe('Высчитывание положения', () => {
    let settings;

    beforeEach(() => {
      settings = {
        currentPosition: [1000],
        minPosition: [0],
        maxPosition: [3500],
        inverted: [false],
      };
    });

    it('Крутим вверх', () => {
      expect(sut.getCmdValue(settings, [2000])).toEqual({cmd: [1000], currentPositions: [2000]});
    });

    it('Крутим вверх, inverted', () => {
      settings.inverted[0] = true;
      expect(sut.getCmdValue(settings, [2000])).toEqual({cmd: [-1000], currentPositions: [2000]});
    });

    it('Крутим вниз', () => {
      expect(sut.getCmdValue(settings, [750])).toEqual({cmd: [-250], currentPositions: [750]});
    });

    it('Крутим вниз, inverted', () => {
      settings.inverted[0] = true;
      expect(sut.getCmdValue(settings, [750])).toEqual({cmd: [250], currentPositions: [750]});
    });

    it('Стоим не месте', () => {
      expect(sut.getCmdValue(settings, [undefined])).toEqual({cmd: [0], currentPositions: [1000]});
    });

    it('Границы корректно обрабатываются', () => {
      expect(sut.getCmdValue(settings, [3500])).toEqual({cmd: [2500], currentPositions: [3500]});
      expect(sut.getCmdValue(settings, [4000])).toEqual({cmd: [2500], currentPositions: [3500]});
      expect(sut.getCmdValue(settings, [+Infinity])).toEqual({
        cmd: [2500],
        currentPositions: [3500],
      });

      expect(sut.getCmdValue(settings, [0])).toEqual({cmd: [-1000], currentPositions: [0]});
      expect(sut.getCmdValue(settings, [-1000])).toEqual({cmd: [-1000], currentPositions: [0]});
      expect(sut.getCmdValue(settings, [-Infinity])).toEqual({cmd: [-1000], currentPositions: [0]});
    });

    it('Много за раз', () => {
      settings = {
        currentPosition: [1000, 500, 300, 1000],
        minPosition: [0, 0, 0, 0],
        maxPosition: [3500, 3400, 3100, 3200],
        inverted: [false, true, false],
      };

      expect(sut.getCmdValue(settings, [+Infinity, +Infinity, undefined, 300])).toEqual({
        cmd: [2500, -2900, 0, -700],
        currentPositions: [3500, 3400, 300, 300],
      });
    });

    it('Если не совпдает длинна с настройками, то кинет ошибку', () => {
      settings = {
        currentPosition: [1000, 500, 300, 1000],
        minPosition: [0, 0, 0, 0],
        maxPosition: [3500, 3400, 3100, 3200],
        inverted: [false, true, false],
      };

      function test() {
        sut.getCmdValue(settings, [+Infinity]);
      }

      expect(test).toThrowErrorMatchingInlineSnapshot(`"Длинны не совпадают"`);
    });
  });

  describe('setPositions', () => {
    let execute;
    let settings;
    let settingsWrite;

    beforeEach(() => {
      settings = {
        settings: {
          currentPosition: [1000, 500, 300, 1000],
          minPosition: [0, 0, 0, 0],
          maxPosition: [3500, 3400, 3100, 3200],
          inverted: [false, true, false],
        },
      };

      execute = jest.fn(async () => {});
      settingsWrite = jest.fn(async () => {});

      sut.settings.write = settingsWrite;
      sut.settings.getSettings = jest.fn(async () => settings);
      sut.bridge = {execute};
      sut.logger = {error: jest.fn(), fatal: jest.fn()};
    });

    it('Отправит новые значения', async () => {
      await sut.setPositions([+Infinity, +Infinity, undefined, 300]);

      expect(execute).toMatchSnapshot();
      expect(settingsWrite).toMatchSnapshot();
    });

    it('Ошибка от устройства - не будем менять настройки', async () => {
      sut.bridge.execute = jest.fn(async () => {
        throw new Error('Bridge error');
      });

      await sut.setPositions([+Infinity, +Infinity, undefined, 300]);

      expect(settingsWrite).not.toBeCalled();
      expect(sut.logger).toMatchSnapshot();
    });

    it('Ошибка при записи в базу', async () => {
      sut.settings.write = jest.fn(async () => {
        throw new Error('Write error');
      });

      await sut.setPositions([+Infinity, +Infinity, undefined, 300]);

      expect(sut.settings.write).toHaveBeenCalledTimes(5);
      expect(sut.logger).toMatchSnapshot();
    });
  });
});
