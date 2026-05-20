const { randomUUID } = require('node:crypto');
const { loggerContext } = require('@/utils/logger');

const traceIdMiddleware = (req, res, next) => {
  const traceId = req.headers['x-trace-id'] || randomUUID();
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);

  loggerContext.run({ traceId }, () => next());
};

module.exports = traceIdMiddleware;
