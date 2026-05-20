require('module-alias/register');
const app = require('./src/app');
const env = require('@/config/env');
const logger = require('@/config/logger');

const start = async () => {
  await app.connectDB();
  app.connectCloudinary();

  app.listen(env.port, () => {
    logger.info(`Server running on PORT ${env.port}`);
  });
};

start();
