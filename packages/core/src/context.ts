import {getEnv, logger, Logger} from 'winteriscomingv2-common';
import amqplib, {Connection} from 'amqplib';
import mysql, {Pool} from 'mysql2/promise';
import {Timer} from './utilities/timer';

const RABBIT_HOST = getEnv('RABBIT_HOST');
const SQL_HOST = getEnv('SQL_HOST');
const SQL_USER = getEnv('SQL_USER');
const SQL_PASSWORD = getEnv('SQL_PASSWORD');
const SQL_DATABASE = getEnv('SQL_DATABASE');

export type Sources = {
  rabbit: Connection;
  sql: Pool;
};
export type Context = {
  sources: Sources;
  logger: Logger;
  timer: Timer;
};

export async function createContext(): Promise<Context> {
  const rabbit = await amqplib.connect(RABBIT_HOST);
  const sql = await mysql.createPool({
    host: SQL_HOST,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const sources = {
    rabbit,
    sql,
  };

  return {
    sources,
    logger: logger.child({app: 'core'}),

    timer: new Timer(),
  };
}

export async function closeSources(sources: Sources): Promise<void> {
  if (sources.rabbit) await sources.rabbit.close();
}
