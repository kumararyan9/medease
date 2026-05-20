const BaseRepository = require('./base.repository');
const PatientProfile = require('@/models/patientProfile.model');

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

module.exports = new PatientProfileRepository();
