import doctorProfileRepo from '@/repositories/doctorProfile.repository.js';
import appointmentRepo from '@/repositories/appointment.repository.js';
import AppError from '@/utils/AppError.js';
import generateTimeSlots from '@/utils/slots.js';
import { validateProfileUpdate, validateAppointmentAction } from './doctor.validator.js';

async function getList() {
  const profiles = await doctorProfileRepo.findPopulated({ available: true });
  return profiles.map((profile) => ({
    _id: profile.userId?._id,
    name: profile.userId?.name,
    image: profile.userId?.image,
    phone: profile.userId?.phone,
    speciality: profile.specialityId,
    degree: profile.degree,
    experienceYears: profile.experienceYears,
    about: profile.about,
    consultationFee: profile.consultationFee,
    address: profile.address,
    available: profile.available,
    languages: profile.languages,
    ratingAverage: profile.ratingAverage,
    totalPatients: profile.totalPatients,
  }));
}

async function getProfile(userId) {
  const profile = await doctorProfileRepo.findByUserIdPopulated(userId);
  if (!profile) {
    throw new AppError('Doctor profile not found.', 404);
  }

  return {
    _id: profile.userId?._id,
    name: profile.userId?.name,
    email: profile.userId?.email,
    image: profile.userId?.image,
    phone: profile.userId?.phone,
    speciality: profile.specialityId,
    degree: profile.degree,
    experienceYears: profile.experienceYears,
    about: profile.about,
    consultationFee: profile.consultationFee,
    address: profile.address,
    available: profile.available,
    languages: profile.languages,
    ratingAverage: profile.ratingAverage,
    totalPatients: profile.totalPatients,
    licenseNumber: profile.licenseNumber,
    hospitalAffiliation: profile.hospitalAffiliation,
    onlineConsultationEnabled: profile.onlineConsultationEnabled,
  };
}

async function updateProfile(userId, data) {
  validateProfileUpdate(data);

  const profile = await doctorProfileRepo.findByUserId(userId);
  if (!profile) {
    throw new AppError('Doctor profile not found.', 404);
  }

  if (data.consultationFee !== undefined) profile.consultationFee = Number(data.consultationFee);
  if (data.address)
    profile.address = typeof data.address === 'string' ? JSON.parse(data.address) : data.address;
  if (data.available !== undefined)
    profile.available = data.available === true || data.available === 'true';
  if (data.languages)
    profile.languages =
      typeof data.languages === 'string' ? JSON.parse(data.languages) : data.languages;
  if (data.about) profile.about = data.about;
  if (data.hospitalAffiliation) profile.hospitalAffiliation = data.hospitalAffiliation;
  if (data.onlineConsultationEnabled !== undefined)
    profile.onlineConsultationEnabled =
      data.onlineConsultationEnabled === true || data.onlineConsultationEnabled === 'true';

  await profile.save();
  return { message: 'Doctor Profile Updated.' };
}

async function getAppointments(userId) {
  return appointmentRepo.findDoctorAppointments(userId);
}

async function completeAppointment(appointmentId, userId) {
  validateAppointmentAction({ appointmentId });

  const appointment = await appointmentRepo.findById(appointmentId);
  if (!appointment) throw new AppError('Appointment not found.', 404);
  if (appointment.doctorId.toString() !== userId) throw new AppError('Not authorized.', 403);
  if (appointment.status === 'CANCELLED')
    throw new AppError('Cannot complete a cancelled appointment.', 400);

  appointment.status = 'COMPLETED';
  await appointment.save();

  await doctorProfileRepo.updateRating(userId);
  return { message: 'Appointment Completed.' };
}

async function cancelAppointment(appointmentId, userId) {
  validateAppointmentAction({ appointmentId });

  const appointment = await appointmentRepo.findById(appointmentId);
  if (!appointment) throw new AppError('Appointment not found.', 404);
  if (appointment.doctorId.toString() !== userId) throw new AppError('Not authorized.', 403);
  if (appointment.status === 'CANCELLED') throw new AppError('Already cancelled.', 400);

  appointment.status = 'CANCELLED';
  appointment.cancelledBy = 'DOCTOR';
  await appointment.save();

  return { message: 'Appointment Cancelled.' };
}

async function getDashboard(userId) {
  const appointments = await appointmentRepo.find({ doctorId: userId });

  let earnings = 0;
  const uniquePatients = new Set();

  for (const apt of appointments) {
    if (apt.status === 'COMPLETED' || apt.paymentStatus === 'PAID') {
      earnings += apt.paymentAmount;
    }
    uniquePatients.add(apt.patientId.toString());
  }

  const latestAppointments = appointments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return {
    earnings,
    appointments: appointments.length,
    patients: uniquePatients.size,
    latestAppointments,
  };
}

async function getAvailableSlots(doctorId, date) {
  const profile = await doctorProfileRepo.findByUserId(doctorId);
  if (!profile) throw new AppError('Doctor not found.', 404);
  if (!profile.available) {
    return { date, availableSlots: [], bookedSlots: [], allSlots: [] };
  }

  const bookedAppointments = await appointmentRepo.findBookedSlots(doctorId, date);
  const bookedSlotStarts = bookedAppointments.map((a) => a.slotStart);

  return generateTimeSlots(date, bookedSlotStarts);
}

export {
  getList,
  getProfile,
  updateProfile,
  getAppointments,
  completeAppointment,
  cancelAppointment,
  getDashboard,
  getAvailableSlots,
};
