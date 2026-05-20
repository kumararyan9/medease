const logger = require('@/utils/logger');
const env = require('@/config/env');
const AppError = require('@/utils/AppError');

const errorHandler = (err, req, res, _next) => {
  const traceId = req.traceId || null;

  if (err instanceof AppError) {
    logger.warn({ traceId, message: err.message, statusCode: err.statusCode, details: err.details }, 'Operational error');
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

  logger.error({ traceId, message: err.message, stack: err.stack }, 'Unhandled error');

  return res.status(500).json({
    success: false,
    message: env.isProduction ? 'Internal server error' : err.message,
    ...(traceId && { traceId }),
  });
};

module.exports = errorHandler;
