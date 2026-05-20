const mongoose = require('mongoose');
const dns = require('dns');
const logger = require('./logger');
const env = require('./env');

const configureDns = () => {
  const customDns = env.dnsServers;
  const currentServers = dns.getServers();

  if (customDns) {
    dns.setServers(customDns);
    logger.info('DNS servers overridden', { servers: customDns });
  } else if (
    currentServers.length === 1 &&
    currentServers[0] === '127.0.0.1' &&
    env.nodeEnv === 'development'
  ) {
    const fallbackDns = ['8.8.8.8', '1.1.1.1'];
    dns.setServers(fallbackDns);
    logger.warn('Node.js DNS is 127.0.0.1 — falling back to public DNS', {
      servers: fallbackDns,
    });
  }
};

const connectDB = async () => {
  configureDns();

  try {
    const conn = await mongoose.connect(`${env.mongodb.uri}/${env.mongodb.dbName}`);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', { error: err.message });
});

module.exports = connectDB;
