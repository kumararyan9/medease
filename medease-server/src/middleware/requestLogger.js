import pinoHttp from 'pino-http';
import pinoLogger from '@/config/logger.js';
import { sanitizeBody } from '@/config/logger.js';

const requestLoggerMiddleware = pinoHttp({
  logger: pinoLogger,
  genReqId: (req) => req.traceId,
  autoLogging: false,
  customLogLevel: (req, res, _err) => {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      traceId: req.id,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

const bodyLoggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const logData = { responseTime };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      logData.body = sanitizeBody(req.body);
    }

    if (res.statusCode >= 500) {
      req.log.error(logData, 'Server error');
    } else if (res.statusCode >= 400) {
      req.log.warn(logData, 'Client error');
    } else {
      req.log.info(logData, 'Request completed');
    }
  });

  next();
};

export { requestLoggerMiddleware, bodyLoggerMiddleware };
export default bodyLoggerMiddleware;
