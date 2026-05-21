import Role from '@/models/role.model.js';
import AppError from '@/utils/AppError.js';

const roleIds = {};

async function getRoleId(slug) {
  if (!roleIds[slug]) {
    const role = await Role.findOne({ slug, isActive: true }).select('_id');
    if (role) roleIds[slug] = role._id;
  }
  return roleIds[slug];
}

async function resolveRoleOrThrow(slug, label) {
  const roleId = await getRoleId(slug);
  if (!roleId) {
    throw new AppError(`${label} role not configured in database. Please seed roles first.`, 500);
  }
  return roleId;
}

export { getRoleId, resolveRoleOrThrow };
