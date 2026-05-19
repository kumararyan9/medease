import { randomUUID } from 'node:crypto';
import { loggerContext } from '@/utils/logger.js';

const traceIdMiddleware = (req, res, next) => {
  const traceId = req.headers['x-trace-id'] || randomUUID();
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);

  loggerContext.run({ traceId }, () => next());
};

export default traceIdMiddleware;
