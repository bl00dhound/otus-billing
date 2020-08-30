const config = {
  logLevel: process.env.LOG_LEVEL,
  port: Number(process.env.PORT || 8001),
  bcryptRounds: Number(process.env.ROUNDS || 10),
  secret: process.env.SECRET,
  rabbitMqURI: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`,
};

export default config;
