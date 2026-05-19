import logger from '@/config/logger.js';
import env from '@/config/env.js';
import AppError from '@/utils/AppError.js';

const errorHandler = (err, req, res, _next) => {
  const traceId = req.traceId || null;

  if (err instanceof AppError) {
    logger.warn('Operational error', {
      traceId,
      message: err.message,
      statusCode: err.statusCode,
      details: err.details,
    });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
      ...(traceId && { traceId }),
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: messages,
      traceId,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      traceId,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      traceId,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      traceId,
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed',
      traceId,
    });
  }

  logger.error('Unhandled error', {
    traceId,
    message: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    success: false,
    message: env.isProduction ? 'Internal server error' : err.message,
    ...(traceId && { traceId }),
  });
};

export default errorHandler;
