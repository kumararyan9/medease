import doctorProfileRepo from '@/repositories/doctorProfile.repository.js';
import appointmentRepo from '@/repositories/appointment.repository.js';
import AppError from '@/utils/AppError.js';
import {
  validateCreateAppointment,
  validateCancelAppointment,
  validatePayment,
} from './appointment.validator.js';

async function createAppointment(
  patientId,
  doctorId,
  slotStart,
  appointmentType = 'ONLINE',
  symptoms = ''
) {
  validateCreateAppointment({ docId: doctorId, slotStart });

  const profile = await doctorProfileRepo.findByUserId(doctorId);
  if (!profile) throw new AppError('Doctor not found.', 404);
  if (!profile.available) throw new AppError('Doctor not available.', 400);

  const slotDate = new Date(slotStart);
  const slotEnd = new Date(slotDate.getTime() + 30 * 60 * 1000);

  const existing = await appointmentRepo.findByDoctorAndSlot(doctorId, slotDate);
  if (existing) throw new AppError('This slot is already booked.', 409);

  const appointment = await appointmentRepo.create({
    doctorId,
    patientId,
    slotStart: slotDate,
    slotEnd,
    paymentAmount: profile.consultationFee,
    appointmentType,
    symptoms,
    status: 'PENDING',
    paymentStatus: 'PENDING',
  });

  return appointmentRepo
    .modelInstance()
    .findById(appointment._id)
    .populate('doctorId', 'name email image')
    .populate('patientId', 'name email image phone');
}

async function getById(appointmentId) {
  const appointment = await appointmentRepo
    .modelInstance()
    .findById(appointmentId)
    .populate('doctorId', 'name email image')
    .populate('patientId', 'name email image phone');

  if (!appointment) throw new AppError('Appointment not found.', 404);
  return appointment;
}

async function cancelAppointment(appointmentId, userId, role) {
  validateCancelAppointment({ appointmentId });

  const appointment = await appointmentRepo.findById(appointmentId);
  if (!appointment) throw new AppError('Appointment not found.', 404);

  if (role === 'PATIENT' && appointment.patientId.toString() !== userId) {
    throw new AppError('Not authorized to cancel this appointment.', 403);
  }
  if (role === 'DOCTOR' && appointment.doctorId.toString() !== userId) {
    throw new AppError('Not authorized to cancel this appointment.', 403);
  }
  if (appointment.status === 'CANCELLED') throw new AppError('Already cancelled.', 400);
  if (appointment.status === 'COMPLETED')
    throw new AppError('Cannot cancel a completed appointment.', 400);

  appointment.status = 'CANCELLED';
  appointment.cancelledBy = role;
  await appointment.save();

  return { message: 'Appointment cancelled.' };
}

async function makePayment(appointmentId, userId) {
  validatePayment({ appointmentId });

  const appointment = await appointmentRepo.findById(appointmentId);
  if (!appointment) throw new AppError('Appointment not found.', 404);
  if (appointment.patientId.toString() !== userId) throw new AppError('Not authorized.', 403);
  if (appointment.status === 'CANCELLED') throw new AppError('Appointment cancelled.', 400);
  if (appointment.paymentStatus === 'PAID') throw new AppError('Payment already completed.', 400);

  appointment.paymentStatus = 'PAID';
  await appointment.save();

  return { message: 'Payment successful.' };
}

export { createAppointment, getById, cancelAppointment, makePayment };
