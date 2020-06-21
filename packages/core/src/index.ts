import {logger} from 'winteriscomingv2-common';
import {closeSources, createContext} from './context';
import type {Connection} from 'amqplib';
import type {Logger} from 'winteriscomingv2-common';
import type {Context} from './context';
import {Bridge} from './bridges/bridge';
import {Zhlz} from './controllers/zhlz';

let context: Context;

export async function main() {
  context = await createContext();

  const bridge = await Bridge.start(context, '1');

  const zhlz = new Zhlz('main', context, bridge, 10);
  await zhlz.waitForInitDone();
  await zhlz.close();
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
