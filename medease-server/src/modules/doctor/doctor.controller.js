const asyncHandler = require('@/utils/asyncHandler');
const ApiResponse = require('@/utils/apiResponse');
const doctorService = require('./doctor.service');
const { loginDoctor } = require('../auth/auth.service');

const getList = asyncHandler(async (req, res) => {
  const doctors = await doctorService.getList();
  ApiResponse.success(res, { data: { doctors } });
});

const login = asyncHandler(async (req, res) => {
  const result = await loginDoctor(req.body.email, req.body.password);
  ApiResponse.success(res, { data: result, message: 'Login successful' });
});

const getProfile = asyncHandler(async (req, res) => {
  const profileData = await doctorService.getProfile(req.user.id);
  ApiResponse.success(res, { data: { profileData } });
});

const updateProfile = asyncHandler(async (req, res) => {
  const result = await doctorService.updateProfile(req.user.id, req.body);
  ApiResponse.success(res, { data: result });
});

const changeAvailability = asyncHandler(async (req, res) => {
  const { docId } = req.body;
  const result = await doctorService.updateProfile(docId, req.body);
  ApiResponse.success(res, { data: result });
});

const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await doctorService.getAppointments(req.user.id);
  ApiResponse.success(res, { data: { appointments } });
});

const completeAppointment = asyncHandler(async (req, res) => {
  const result = await doctorService.completeAppointment(req.body.appointmentId, req.user.id);
  ApiResponse.success(res, { data: result });
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const result = await doctorService.cancelAppointment(req.body.appointmentId, req.user.id);
  ApiResponse.success(res, { data: result });
});

const getDashboard = asyncHandler(async (req, res) => {
  const dashData = await doctorService.getDashboard(req.user.id);
  ApiResponse.success(res, { data: { dashData } });
});

const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const slots = await doctorService.getAvailableSlots(req.params.id, date);
  ApiResponse.success(res, { data: slots });
});

module.exports = {
  getList,
  login,
  getProfile,
  updateProfile,
  changeAvailability,
  getAppointments,
  completeAppointment,
  cancelAppointment,
  getDashboard,
  getAvailableSlots,
};
