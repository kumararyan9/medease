import AppError from '@/utils/AppError.js';

function validateCreateAppointment(data) {
  const { docId, slotStart } = data;

  if (!docId) throw new AppError('Doctor ID is required.', 400);
  if (!slotStart) throw new AppError('Slot start time is required.', 400);

  const slotDate = new Date(slotStart);
  if (isNaN(slotDate.getTime())) {
    throw new AppError('Invalid slot start time format.', 400);
  }
  if (slotDate < new Date()) {
    throw new AppError('Cannot book appointment in the past.', 400);
  }
}

function validateCancelAppointment(data) {
  if (!data.appointmentId) throw new AppError('Appointment ID is required.', 400);
}

function validatePayment(data) {
  if (!data.appointmentId) throw new AppError('Appointment ID is required.', 400);
}

export { validateCreateAppointment, validateCancelAppointment, validatePayment };
