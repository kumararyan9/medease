import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';
import env from './env.js';

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
  logger.info('Cloudinary configured');
};

export default connectCloudinary;
