import bus from '../../providers/bus';
import logger from '../../providers/logger';
import { checkConnection } from '../../providers/db';
import AccountService from '../../services/account';

process.on('uncaughtException', (err) => {
  logger.fatal('[Users Worker fatal error]: ', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

checkConnection();

Promise.all([
  bus.subscribe('user:createUser', 'user', AccountService.createAccount),
  bus.subscribe('user:replenishBalance', 'user', AccountService.replenishBalance),
  bus.subscribe('user:createOrder', 'user', AccountService.createOrder),
]);
