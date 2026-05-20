const asyncHandler = require('@/utils/asyncHandler');
const ApiResponse = require('@/utils/apiResponse');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  ApiResponse.created(res, { data: result, message: 'User registered successfully' });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password);
  ApiResponse.success(res, { data: result, message: 'Login successful' });
});

const doctorLogin = asyncHandler(async (req, res) => {
  const result = await authService.loginDoctor(req.body.email, req.body.password);
  ApiResponse.success(res, { data: result, message: 'Login successful' });
});

const adminLogin = asyncHandler(async (req, res) => {
  const result = await authService.loginAdmin(req.body.email, req.body.password);
  ApiResponse.success(res, { data: result, message: 'Login successful' });
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getUserProfile(req.user.id, req.user.role);
  ApiResponse.success(res, { data: { userData: profile, profileData: profile } });
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await authService.updateUserProfile(req.user.id, req.body, req.file);
  ApiResponse.success(res, { data: { userData: profile }, message: 'Profile updated' });
});

module.exports = { register, login, doctorLogin, adminLogin, getProfile, updateProfile };
