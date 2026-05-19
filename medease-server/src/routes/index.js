import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes.js';
import adminRoutes from '@/modules/admin/admin.routes.js';
import doctorRoutes from '@/modules/doctor/doctor.routes.js';
import patientRoutes from '@/modules/patient/patient.routes.js';
import appointmentRoutes from '@/modules/appointment/appointment.routes.js';
import specialityRoutes from '@/modules/speciality/speciality.routes.js';
import * as doctorController from '@/modules/doctor/doctor.controller.js';

const router = Router();

router.use('/user', authRoutes);
router.use('/user', patientRoutes);
router.use('/user', appointmentRoutes);
router.use('/admin', adminRoutes);
router.use('/doctor', doctorRoutes);
router.use('/specialities', specialityRoutes);
router.get('/doctors/:id/slots', doctorController.getAvailableSlots);

export default router;
