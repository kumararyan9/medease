const { Router } = require('express');
const { authenticate, requireRole } = require('@/middleware/auth');
const specialityController = require('./speciality.controller');

const router = Router();

router.get('/', specialityController.getAll);
router.get('/active', specialityController.getActive);
router.get('/:id', specialityController.getById);
router.post('/', authenticate, requireRole('ADMIN'), specialityController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), specialityController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), specialityController.remove);

module.exports = router;
