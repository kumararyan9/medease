import pino from 'pino';
import env from './env.js';

const sensitiveFields = ['password', 'token', 'atoken', 'dtoken', 'authorization', 'secret', 'creditCard'];

export function sanitizeBody(body) {
  if (!body || typeof body !== 'object') return body;
  const sanitized = { ...body };
  for (const key of Object.keys(sanitized)) {
    if (sensitiveFields.some((f) => key.toLowerCase().includes(f))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeBody(sanitized[key]);
    }
  }
  return sanitized;
}

const transport = env.isProduction
  ? undefined
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
        singleLine: true,
      },
    };

const logger = pino({
  level: env.isProduction ? 'info' : 'debug',
  transport,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.token',
      'body.atoken',
      'body.dtoken',
      'body.creditCard',
    ],
    censor: '[REDACTED]',
  },
});

export default logger;
