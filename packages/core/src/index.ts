import {logger} from 'winteriscomingv2-common';
import {closeSources, createContext} from './context';

import express from 'express';
import graphqlHTTP from 'express-graphql';

import {Bridge} from './bridges/bridge';
import {Zhlz} from './controllers/zhlz';
import {Flower} from './controllers/flower';
import {TimerAction} from './actions/timer';
import {init} from './utilities/init';
import Schema from './graphql/schema';

import type {Connection} from 'amqplib';
import type {Logger} from 'winteriscomingv2-common';
import type {Context} from './context';

let context: Context;

const PORT = 4000;

export async function main() {
  context = await createContext();

  const bridge = await Bridge.start(context, '1');

  const controllers = {
    flower: new Flower('kitchen-1', context, bridge, 11),
    // zhzlMainRoom: new Zhlz('main', context, bridge, 10),
  };

  const actions = {
    // zhzlMainRoomTimer: new TimerAction({
    //   name: 'zhzlMainRoomTimerAction',
    //   controller: controllers.flower,
    //   context,
    // }),
  };

  await init(controllers, actions, context);

  const app = express();

  app.use(
    '/graphql',
    graphqlHTTP({
      schema: Schema,
      graphiql: true,
      context,
    })
  );

  app.listen(PORT);
  logger.info({port: PORT}, 'Graphql server start');
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
