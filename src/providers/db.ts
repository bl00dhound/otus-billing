import knex from 'knex';

import logger from './logger';
import config from '../config/knexfile';

const db = knex(config);

logger.info(db.client.config.connection);

export const checkConnection = () => db.raw('select 1').catch((error) => {
  logger.error(error);
  logger.error(db.client.config.connection);
  logger.error('db connection error', () => process.exit(1));
});

export default db;
