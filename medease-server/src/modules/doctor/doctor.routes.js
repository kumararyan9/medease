import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import * as doctorController from './doctor.controller.js';

const router = Router();

router.get('/list', doctorController.getList);
router.post('/login', doctorController.login);
router.get('/appointments', authenticate, requireRole('DOCTOR'), doctorController.getAppointments);
router.post(
  '/complete-appointment',
  authenticate,
  requireRole('DOCTOR'),
  doctorController.completeAppointment
);
router.post(
  '/cancel-appointment',
  authenticate,
  requireRole('DOCTOR'),
  doctorController.cancelAppointment
);
router.get('/dashboard', authenticate, requireRole('DOCTOR'), doctorController.getDashboard);
router.get('/profile', authenticate, requireRole('DOCTOR'), doctorController.getProfile);
router.post('/update-profile', authenticate, requireRole('DOCTOR'), doctorController.updateProfile);

export default router;
