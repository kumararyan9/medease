const AppError = require('@/utils/AppError');

function validateCreateSpeciality(data) {
  if (!data.name || !data.name.trim()) {
    throw new AppError('Speciality name is required.', 400);
  }
}

function validateUpdateSpeciality(data) {
  if (data.name !== undefined && !data.name.trim()) {
    throw new AppError('Speciality name cannot be empty.', 400);
  }
}

module.exports = { validateCreateSpeciality, validateUpdateSpeciality };
