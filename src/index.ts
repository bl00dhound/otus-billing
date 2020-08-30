import express, { Request, Response, NextFunction } from 'express';
import httpShutdown from 'http-shutdown';
import httpLogger from 'express-pino-logger';
import bodyParser from 'body-parser';

import http from 'http';

import Config from './config';
import { checkConnection } from './providers/db';
import logger from './providers/logger';
import api from './api';

const app = express();
const server = httpShutdown(http.createServer(app));

const shutdown = () => {
  server.shutdown(() => logger.info('server is stopped'));
  process.exit(0);
};

const startCb = () => {
  logger.info('server is started', {
    pid: process.pid,
    port: Config.port,
  });
};

process.on('uncaughtException', (error) => {
  logger.fatal({
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

checkConnection();

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.startEpoch = Date.now();
  next();
});

app.use(httpLogger({ logger }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', api);

app.use('*', (_req, res) => res.status(404).send({ message: 'Resource not found' }));

server.listen(Config.port, '0.0.0.0', startCb);

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
