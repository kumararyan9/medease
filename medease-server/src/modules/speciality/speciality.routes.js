import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import * as specialityController from './speciality.controller.js';

const router = Router();

router.get('/', specialityController.getAll);
router.get('/active', specialityController.getActive);
router.get('/:id', specialityController.getById);
router.post('/', authenticate, requireRole('ADMIN'), specialityController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), specialityController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), specialityController.remove);

export default router;
