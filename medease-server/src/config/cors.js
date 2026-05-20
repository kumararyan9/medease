const env = require('@/config/env');

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = env.cors.allowedOrigins;

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins === '*') {
      return callback(null, true);
    }

    if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'aToken',
    'dToken',
    'token',
  ],
  exposedHeaders: ['x-trace-id'],
};

module.exports = corsOptions;
