const { v2: cloudinary } = require('cloudinary');
const logger = require('./logger');
const env = require('./env');

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
  logger.info('Cloudinary configured');
};

module.exports = connectCloudinary;
