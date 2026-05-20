const validator = require('validator');
const AppError = require('@/utils/AppError');

function validateAddDoctorInput(data, imageFile) {
  const {
    name,
    email,
    password,
    specialityId,
    degree,
    experienceYears,
    about,
    consultationFee,
    address,
  } = data;

  if (!name) throw new AppError('Name is required', 400);
  if (!email) throw new AppError('Email is required', 400);
  if (!validator.isEmail(email)) throw new AppError('Please enter a valid email!', 400);
  if (!password) throw new AppError('Password is required', 400);
  if (password.length < 8) throw new AppError('Password must be at least 8 characters long!', 400);
  if (!specialityId) throw new AppError('Speciality is required', 400);
  if (!degree) throw new AppError('Degree is required', 400);
  if (experienceYears === undefined || experienceYears === null)
    throw new AppError('Experience is required', 400);
  if (isNaN(Number(experienceYears)) || Number(experienceYears) < 0)
    throw new AppError('Invalid experience value', 400);
  if (!about) throw new AppError('About is required', 400);
  if (!consultationFee) throw new AppError('Consultation fee is required', 400);
  if (isNaN(Number(consultationFee)) || Number(consultationFee) < 0)
    throw new AppError('Invalid fee value', 400);
  if (!address) throw new AppError('Address is required', 400);
  if (!imageFile) throw new AppError('Image is required', 400);
}

function validateCancelAppointment(data) {
  if (!data.appointmentId) throw new AppError('Appointment ID is required', 400);
}

module.exports = { validateAddDoctorInput, validateCancelAppointment };
