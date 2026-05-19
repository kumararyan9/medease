import AppError from '@/utils/AppError.js';

function validateProfileUpdate(data) {
  if (
    data.consultationFee !== undefined &&
    (isNaN(Number(data.consultationFee)) || Number(data.consultationFee) < 0)
  ) {
    throw new AppError('Invalid consultation fee value.', 400);
  }
  if (data.address && typeof data.address === 'string') {
    try {
      JSON.parse(data.address);
    } catch {
      throw new AppError('Address must be valid JSON.', 400);
    }
  }
}

function validateAppointmentAction(data) {
  if (!data.appointmentId) {
    throw new AppError('Appointment ID is required.', 400);
  }
}

export { validateProfileUpdate, validateAppointmentAction };
