const { Router } = require('express');
const authRoutes = require('@/modules/auth/auth.routes');
const adminRoutes = require('@/modules/admin/admin.routes');
const doctorRoutes = require('@/modules/doctor/doctor.routes');
const patientRoutes = require('@/modules/patient/patient.routes');
const appointmentRoutes = require('@/modules/appointment/appointment.routes');
const specialityRoutes = require('@/modules/speciality/speciality.routes');
const doctorController = require('@/modules/doctor/doctor.controller');

const router = Router();

router.use('/user', authRoutes);
router.use('/user', patientRoutes);
router.use('/user', appointmentRoutes);
router.use('/admin', adminRoutes);
router.use('/doctor', doctorRoutes);
router.use('/specialities', specialityRoutes);
router.get('/doctors/:id/slots', doctorController.getAvailableSlots);

module.exports = router;
