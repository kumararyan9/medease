import specialityRepo from '@/repositories/speciality.repository.js';
import AppError from '@/utils/AppError.js';
import {
  validateCreateSpeciality,
  validateUpdateSpeciality,
} from './speciality.validator.js';

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function getAll() {
  return specialityRepo.find({}).sort({ name: 1 });
}

async function getActive() {
  return specialityRepo.findActive();
}

async function getById(id) {
  const speciality = await specialityRepo.findById(id);
  if (!speciality) throw new AppError('Speciality not found.', 404);
  return speciality;
}

async function create(data) {
  validateCreateSpeciality(data);

  const slug = data.slug || toSlug(data.name);
  const existing = await specialityRepo.findBySlug(slug);
  if (existing) throw new AppError('Speciality with this slug already exists.', 409);

  return specialityRepo.create({
    name: data.name,
    slug,
    description: data.description || '',
    isActive: data.isActive !== undefined ? data.isActive : true,
  });
}

async function update(id, data) {
  validateUpdateSpeciality(data);

  const speciality = await specialityRepo.findById(id);
  if (!speciality) throw new AppError('Speciality not found.', 404);

  if (data.name) {
    speciality.name = data.name;
    speciality.slug = data.slug || toSlug(data.name);
  }
  if (data.description !== undefined) speciality.description = data.description;
  if (data.isActive !== undefined) speciality.isActive = data.isActive;

  return speciality.save();
}

async function remove(id) {
  const speciality = await specialityRepo.findById(id);
  if (!speciality) throw new AppError('Speciality not found.', 404);
  await specialityRepo.delete(id);
  return { message: 'Speciality deleted successfully.' };
}

export { getAll, getActive, getById, create, update, remove };
