import AppError from '@/utils/AppError.js';

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

export { validateCreateSpeciality, validateUpdateSpeciality };
