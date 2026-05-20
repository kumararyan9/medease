const validator = require('validator');
const AppError = require('@/utils/AppError');

function validateRegisterInput({ name, email, password }) {
  if (!name || !name.trim()) {
    throw new AppError('Name is required', 400);
  }
  if (!email) {
    throw new AppError('Email is required', 400);
  }
  if (!validator.isEmail(email)) {
    throw new AppError('Please enter a valid email address.', 400);
  }
  if (!password) {
    throw new AppError('Password is required', 400);
  }
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long.', 400);
  }
}

function validateLoginInput({ email, password }) {
  if (!email || !password) {
    throw new AppError('Please provide email and password.', 400);
  }
}

function validateProfileUpdateInput(data) {
  if (data.phone && !validator.isMobilePhone(data.phone, 'any')) {
    throw new AppError('Invalid phone number format.', 400);
  }
  if (data.name && !data.name.trim()) {
    throw new AppError('Name cannot be empty.', 400);
  }
}

module.exports = { validateRegisterInput, validateLoginInput, validateProfileUpdateInput };
