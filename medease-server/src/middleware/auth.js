const jwt = require('jsonwebtoken');
const AppError = require('@/utils/AppError');
const asyncHandler = require('@/utils/asyncHandler');
const env = require('@/config/env');
const User = require('@/models/user.model');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    token = req.headers.atoken || req.headers.dtoken || req.headers.token;
  }

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwt.secret);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  if (decoded.id === 'admin') {
    req.user = { id: 'admin', role: 'ADMIN', roleSlug: 'admin', permissions: [], name: 'Admin' };
    return next();
  }

  const user = await User.findById(decoded.id).select('-password').populate('roleId');
  if (!user) {
    throw new AppError('User not found', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  const roleData = user.roleId;
  req.user = {
    id: user._id.toString(),
    roleId: roleData._id.toString(),
    role: roleData.name,
    roleSlug: roleData.slug,
    permissions: roleData.permissions || [],
    email: user.email,
    name: user.name,
    image: user.image,
  };

  next();
});

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
};

const requirePermission = (...perms) => {
  return (req, res, next) => {
    if (!req.user || !perms.every((p) => req.user.permissions.includes(p))) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { authenticate, requireRole, requirePermission };
