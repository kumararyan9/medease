import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import upload from '@/middleware/multer.js';
import * as adminController from './admin.controller.js';

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

export default router;
