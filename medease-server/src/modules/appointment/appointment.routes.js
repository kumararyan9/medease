import { Router } from 'express';
import { authenticate } from '@/middleware/auth.js';
import * as appointmentController from './appointment.controller.js';

const router = Router();

router.post('/book-appointment', authenticate, appointmentController.create);
router.get('/:id', authenticate, appointmentController.getById);
router.post('/cancel-appointment', authenticate, appointmentController.cancel);
router.post('/make-payment', authenticate, appointmentController.makePayment);

export default router;
