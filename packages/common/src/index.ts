require('dotenv').config();

import _logger from './logger';
export const logger = _logger;
export type Logger = typeof _logger;

export {getEnv} from './utils/getEnv';

export * from './constants';
