import env from '@/config/env.js';

const ALLOWED_METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'atoken',
  'dtoken',
  'token',
];
const EXPOSED_HEADERS = ['x-trace-id'];

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = env.cors.allowedOrigins;

  let allowed = false;

  if (!origin) {
    allowed = true;
  } else if (allowedOrigins === '*') {
    allowed = true;
  } else if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
    allowed = true;
  }

  if (!allowed) {
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
  res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '));
  res.setHeader('Access-Control-Expose-Headers', EXPOSED_HEADERS.join(', '));
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  next();
};

export default corsMiddleware;
