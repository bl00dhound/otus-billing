import evque from 'evque';

import logger from './logger';
import Config from '../config';

logger.info(Config.rabbitMqURI);

const bus = evque({
  url: Config.rabbitMqURI,
  prefetch: 1,
});

bus.on('error', (event) => logger.error({
  event: event.event,
  listener: event.listener,
  data: JSON.stringify(event.data),
  error: event.error.message,
  stack: event.error.stack,
  validationError: event.error.errors,
}, '[Bus processing error]: '));

bus.on('connection-error', () => {
  logger.error('[Bus connection error]', () => process.exit(1));
});

bus.publish('app:startTest', {})
  .catch((err) => {
    logger.error({
      error: err.message,
      stack: err.stack,
    }, '[Bus start test failed]');
    process.exit(1);
  });

export default bus;
