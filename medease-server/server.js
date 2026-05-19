import app, { connectDB, connectCloudinary } from './src/app.js';
import env from './src/config/env.js';
import logger from './src/config/logger.js';

const start = async () => {
  await connectDB();
  connectCloudinary();

  app.listen(env.port, () => {
    logger.info(`Server running on PORT ${env.port}`);
  });
};

start();
