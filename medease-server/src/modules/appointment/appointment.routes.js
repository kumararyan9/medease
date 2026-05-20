const { Router } = require('express');
const { authenticate } = require('@/middleware/auth');
const appointmentController = require('./appointment.controller');

const router = Router();

router.post('/book-appointment', authenticate, appointmentController.create);
router.get('/:id', authenticate, appointmentController.getById);
router.post('/cancel-appointment', authenticate, appointmentController.cancel);
router.post('/make-payment', authenticate, appointmentController.makePayment);

module.exports = router;
