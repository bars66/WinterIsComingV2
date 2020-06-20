import {getEnv, logger, Logger} from 'winteriscomingv2-common';
import amqplib, {Connection} from 'amqplib';

const RABBIT_HOST = getEnv('RABBIT_HOST');
export type Sources = {
  rabbit: Connection;
};
export type Context = {
  sources: Sources;
  logger: Logger;
};

export async function createContext(): Promise<Context> {
  const rabbit = await amqplib.connect(RABBIT_HOST);

  const sources = {
    rabbit,
  };

  return {
    sources,
    logger: logger.child({app: 'core'}),
  };
}

export async function closeSources(sources: Sources): Promise<void> {
  if (sources.rabbit) await sources.rabbit.close();
}
