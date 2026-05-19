import BaseRepository from './base.repository.js';
import Appointment from '@/models/appointment.model.js';

class AppointmentRepository extends BaseRepository {
  constructor() {
    super(Appointment);
  }

  async findByDoctorAndSlot(doctorId, slotStart) {
    return this.findOne({ doctorId, slotStart, status: { $ne: 'CANCELLED' } });
  }

  async findBookedSlots(doctorId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.find({
      doctorId,
      slotStart: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'CANCELLED' },
    }).select('slotStart');

    return appointments;
  }

  async findPatientAppointments(patientId) {
    return this.model
      .find({ patientId })
      .populate('doctorId', 'name email image')
      .populate({
        path: 'doctorId',
        populate: { path: 'profile', model: 'DoctorProfile' },
      })
      .sort({ slotStart: -1 });
  }

  async findDoctorAppointments(doctorId) {
    return this.model
      .find({ doctorId })
      .populate('patientId', 'name email image phone')
      .sort({ slotStart: -1 });
  }

  async findDoctorAppointmentsPopulated(doctorId) {
    return this.model
      .find({ doctorId })
      .populate('patientId', 'name email image phone')
      .populate('patientId')
      .sort({ slotStart: -1 });
  }

  async findPopulated(filter = {}) {
    return this.model
      .find(filter)
      .populate('patientId', 'name email image phone')
      .populate('doctorId', 'name email image')
      .sort({ createdAt: -1 });
  }

  async findLatest(limit = 5) {
    return this.model
      .find({})
      .populate('patientId', 'name image')
      .populate('doctorId', 'name image')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export default new AppointmentRepository();
