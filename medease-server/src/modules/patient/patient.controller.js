const asyncHandler = require('@/utils/asyncHandler');
const ApiResponse = require('@/utils/apiResponse');
const patientService = require('./patient.service');

const getProfile = asyncHandler(async (req, res) => {
  const userData = await patientService.getProfile(req.user.id);
  ApiResponse.success(res, { data: { userData } });
});

const updateProfile = asyncHandler(async (req, res) => {
  const userData = await patientService.updateProfile(req.user.id, req.body);
  ApiResponse.success(res, { data: { userData }, message: 'Profile updated' });
});

const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await patientService.getAppointments(req.user.id);
  ApiResponse.success(res, { data: { appointments } });
});

module.exports = { getProfile, updateProfile, getAppointments };
