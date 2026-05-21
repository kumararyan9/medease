const { Router } = require('express');
const { authenticate, requireRole } = require('@/middleware/auth');
const upload = require('@/middleware/upload.middleware');
const adminController = require('./admin.controller');

const router = Router();

router.post('/login', adminController.login);
router.post(
  '/add-doctor',
  authenticate,
  requireRole('ADMIN'),
  upload.single('image'),
  adminController.addDoctor
);
router.get('/all-doctors', authenticate, requireRole('ADMIN'), adminController.getAllDoctors);
router.post(
  '/change-availability',
  authenticate,
  requireRole('ADMIN'),
  adminController.changeAvailability
);
router.get('/appointments', authenticate, requireRole('ADMIN'), adminController.getAllAppointments);
router.post(
  '/cancel-appointment',
  authenticate,
  requireRole('ADMIN'),
  adminController.cancelAppointment
);
router.get('/dashboard', authenticate, requireRole('ADMIN'), adminController.getDashboard);
router.put(
  '/update-doctor/:id',
  authenticate,
  requireRole('ADMIN'),
  upload.single('image'),
  adminController.updateDoctor
);
router.delete(
  '/doctors/:id',
  authenticate,
  requireRole('ADMIN'),
  adminController.removeDoctor
);
router.get('/users', authenticate, requireRole('ADMIN'), adminController.getUsers);

module.exports = router;
