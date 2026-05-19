import BaseRepository from './base.repository.js';
import DoctorProfile from '@/models/doctorProfile.model.js';
import '@/models/speciality.model.js';

class DoctorProfileRepository extends BaseRepository {
  constructor() {
    super(DoctorProfile);
  }

  async findByUserId(userId) {
    return this.findOne({ userId });
  }

  async findBySpeciality(specialityId, options = {}) {
    return this.find({ specialityId, available: true }, options);
  }

  async findAvailable(specialityId) {
    return this.find({ ...(specialityId && { specialityId }), available: true });
  }

  async findByUserIdPopulated(userId) {
    return this.model
      .findOne({ userId })
      .populate('userId', 'name email image phone')
      .populate('specialityId', 'name slug');
  }

  async findPopulated(filter = {}) {
    return this.model
      .find(filter)
      .populate('userId', 'name email image phone')
      .populate('specialityId', 'name slug');
  }

  async updateRating(doctorUserId) {
    const stats = await this.model.aggregate([
      { $match: { userId: doctorUserId } },
      {
        $lookup: {
          from: 'appointments',
          localField: 'userId',
          foreignField: 'doctorId',
          as: 'appointments',
        },
      },
      {
        $addFields: {
          totalAppointments: { $size: '$appointments' },
        },
      },
      { $project: { appointments: 0 } },
    ]);

    if (stats.length > 0) {
      await this.update(doctorUserId, {
        totalAppointments: stats[0].totalAppointments,
      });
    }
  }
}

export default new DoctorProfileRepository();
