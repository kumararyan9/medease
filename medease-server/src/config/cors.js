  import env from '@/config/env.js';

  const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = env.cors.allowedOrigins;

      // Allow requests with no origin (like curl or Postman)
      if (!origin) {
        return callback(null, true);
      }

      // If allowedOrigins is '*', allow all origins
      if (allowedOrigins === '*') {
        return callback(null, true);
      }

      // If allowedOrigins is an array, check if origin is in the array
      if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Otherwise, reject
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

  export default corsOptions;
