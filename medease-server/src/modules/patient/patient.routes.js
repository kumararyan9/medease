const { Router } = require('express');
const { authenticate, requireRole } = require('@/middleware/auth');
const patientController = require('./patient.controller');

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

module.exports = router;
