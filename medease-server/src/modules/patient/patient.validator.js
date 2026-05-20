const validator = require('validator');
const AppError = require('@/utils/AppError');

function validateProfileUpdate(data) {
  if (data.phone && !validator.isMobilePhone(data.phone, 'any')) {
    throw new AppError('Invalid phone number format.', 400);
  }
  if (data.name !== undefined && !data.name.trim()) {
    throw new AppError('Name cannot be empty.', 400);
  }
  if (data.gender && !['Male', 'Female', 'Other'].includes(data.gender)) {
    throw new AppError('Gender must be Male, Female, or Other.', 400);
  }
  if (data.dob && isNaN(new Date(data.dob).getTime())) {
    throw new AppError('Invalid date of birth format.', 400);
  }
  if (data.bloodGroup && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(data.bloodGroup)) {
    throw new AppError('Invalid blood group.', 400);
  }
  if (data.address && typeof data.address === 'string') {
    try {
      JSON.parse(data.address);
    } catch {
      throw new AppError('Address must be valid JSON.', 400);
    }
  }
}

module.exports = { validateProfileUpdate };
