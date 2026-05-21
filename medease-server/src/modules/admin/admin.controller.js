const asyncHandler = require('@/utils/asyncHandler');
const ApiResponse = require('@/utils/apiResponse');
const adminService = require('./admin.service');
const { loginAdmin } = require('../auth/auth.service');

const addDoctor = asyncHandler(async (req, res) => {
  const result = await adminService.addDoctor(req.body, req.file);
  ApiResponse.created(res, { data: result });
});

const login = asyncHandler(async (req, res) => {
  const result = await loginAdmin(req.body.email, req.body.password);
  ApiResponse.success(res, { data: result, message: 'Login successful' });
});

const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await adminService.getAllDoctors();
  ApiResponse.success(res, { data: { doctors } });
});

const changeAvailability = asyncHandler(async (req, res) => {
  const { docId } = req.body;
  const result = await adminService.changeAvailability(docId);
  ApiResponse.success(res, { data: result });
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await adminService.getAllAppointments();
  ApiResponse.success(res, { data: { appointments } });
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const result = await adminService.cancelAppointment(req.body.appointmentId);
  ApiResponse.success(res, { data: result });
});

const getDashboard = asyncHandler(async (req, res) => {
  const dashData = await adminService.getDashboard();
  ApiResponse.success(res, { data: { dashData } });
});

const updateDoctor = asyncHandler(async (req, res) => {
  const result = await adminService.updateDoctor(req.params.id, req.body, req.file);
  ApiResponse.success(res, { data: result, message: 'Doctor updated successfully' });
});

const removeDoctor = asyncHandler(async (req, res) => {
  const result = await adminService.removeDoctor(req.params.id);
  ApiResponse.success(res, { data: result, message: 'Doctor removed successfully' });
});

const getUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query);
  ApiResponse.success(res, { data: result });
});

module.exports = {
  addDoctor,
  login,
  getAllDoctors,
  changeAvailability,
  getAllAppointments,
  cancelAppointment,
  getDashboard,
  updateDoctor,
  removeDoctor,
  getUsers,
};
