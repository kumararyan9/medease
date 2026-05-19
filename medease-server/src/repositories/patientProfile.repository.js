import BaseRepository from './base.repository.js';
import PatientProfile from '@/models/patientProfile.model.js';

class PatientProfileRepository extends BaseRepository {
  constructor() {
    super(PatientProfile);
  }

  async findByUserId(userId) {
    return this.findOne({ userId });
  }

  async findByUserIdPopulated(userId) {
    return this.model.findOne({ userId }).populate('userId', 'name email image phone');
  }

  async upsert(userId, data) {
    return this.model.findOneAndUpdate({ userId }, data, {
      upsert: true,
      new: true,
    });
  }
}

export default new PatientProfileRepository();
