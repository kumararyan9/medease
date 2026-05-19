import winston from 'winston';
import env from './env.js';

const sensitiveFields = ['password', 'token', 'atoken', 'dtoken', 'authorization', 'secret'];

function sanitizeBody(body) {
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

const logger = winston.createLogger({
  level: env.isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    env.isProduction
      ? winston.format.json()
      : winston.format.printf(
          ({
            timestamp,
            level,
            message,
            traceId,
            method,
            route,
            statusCode,
            responseTime,
            body: _body,
            ...meta
          }) => {
            const parts = [`[${timestamp}] ${level.toUpperCase()}`];
            if (traceId) parts.push(`traceId=${traceId}`);
            if (method) parts.push(`${method}`);
            if (route) parts.push(route);
            if (statusCode) parts.push(`→ ${statusCode}`);
            if (responseTime) parts.push(`${responseTime}ms`);
            if (message) parts.push(`- ${message}`);
            const extras = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return parts.join(' ') + (extras ? ` ${extras}` : '');
          }
        )
  ),
  transports: [new winston.transports.Console()],
});

export { sanitizeBody };
export default logger;
