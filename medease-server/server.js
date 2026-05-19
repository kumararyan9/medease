import app, { connectDB, connectCloudinary } from '@/app.js';
import env from '@/config/env.js';
import logger from '@/config/logger.js';

const start = async () => {
  await connectDB();
  connectCloudinary();

  app.listen(env.port, () => {
    logger.info(`Server running on PORT ${env.port}`);
  });
};

start();
