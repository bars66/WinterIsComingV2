import {logger} from 'winteriscomingv2-common';
import {closeSources, createContext} from './context';
import type {Connection} from 'amqplib';
import type {Logger} from 'winteriscomingv2-common';
import type {Context} from './context';

import {Bridge} from './bridges/bridge';
import {Zhlz} from './controllers/zhlz';
import {AbstractController} from './controllers/abstract';
import {TimerAction} from './actions/timer';
import {AbstractAction} from './actions/abstract';

let context: Context;

export async function main() {
  context = await createContext();

  const bridge = await Bridge.start(context, '1');

  const controllers = {
    zhzlMainRoom: new Zhlz('main', context, bridge, 10),
  };

  const actions = {
    zhzlMainRoomTimer: new TimerAction({
      name: 'zhzlMainRoomTimerAction',
      controller: controllers.zhzlMainRoom,
      context,
    }),
  };

  await init(controllers, actions, context);
}

type ControllersMap = {[key: string]: AbstractController};
type ActionsMap = {[key: string]: AbstractAction};

async function init(controllers: ControllersMap, actions: ActionsMap, context: Context) {
  const controllersAsArray = Object.values(controllers);

  logger.info('Begin controllers init');

  await Promise.all(
    controllersAsArray.map(async (c: AbstractController) => {
      await c.waitForInitDone();
      logger.info({id: c.getId()}, 'Init done');
    })
  );

  const actionsAsArray = Object.values(actions);
  await Promise.all(
    actionsAsArray.map(async (action: AbstractAction) => {
      await action.init();
      action.start();
    })
  );
}

main().catch((e) => logger.fatal({error: e}, 'Error on main fn'));

process.on('unhandledRejection', async (error) => {
  logger.fatal({error}, 'Unhandled promise rejection');

  try {
    if (context.sources) await closeSources(context.sources);
  } catch (e) {
    logger.fatal({error: e}, 'Unhandled promise sources close failed');
  }

  process.exit(-1);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received.');

  try {
    if (context.sources) await closeSources(context.sources);
  } catch (e) {
    logger.fatal({error: e}, 'SIGTERM sources close failed');
  }

  process.exit(0);
});
