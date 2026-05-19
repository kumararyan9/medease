import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import * as patientController from './patient.controller.js';

const router = Router();

router.get('/get-profile', authenticate, requireRole('PATIENT'), patientController.getProfile);
router.post(
  '/update-profile',
  authenticate,
  requireRole('PATIENT'),
  patientController.updateProfile
);
router.get(
  '/appointments',
  authenticate,
  requireRole('PATIENT'),
  patientController.getAppointments
);

export default router;
