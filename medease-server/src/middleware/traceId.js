import { v4 as uuidv4 } from 'uuid';

const traceIdMiddleware = (req, res, next) => {
  const traceId = req.headers['x-trace-id'] || uuidv4();
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);
  next();
};

export default traceIdMiddleware;
