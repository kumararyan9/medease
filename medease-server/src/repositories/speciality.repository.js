import BaseRepository from './base.repository.js';
import Speciality from '@/models/speciality.model.js';

class SpecialityRepository extends BaseRepository {
  constructor() {
    super(Speciality);
  }

  async findBySlug(slug) {
    return this.findOne({ slug: slug.toLowerCase() });
  }

  async findActive() {
    return this.find({ isActive: true }).sort({ name: 1 });
  }

  async findByName(name) {
    return this.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  }
}

export default new SpecialityRepository();
