import logger, { sanitizeBody } from '@/config/logger.js';

const requestLoggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const logData = {
      traceId: req.traceId,
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
    };

    if (req.body && Object.keys(req.body).length > 0) {
      logData.body = sanitizeBody(req.body);
    }

    if (res.statusCode >= 500) {
      logger.error('Server error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Client error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};

export default requestLoggerMiddleware;
