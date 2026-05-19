import { Router } from 'express';
import { authenticate } from '@/middleware/auth.js';
import upload from '@/middleware/multer.js';
import * as authController from './auth.controller.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/get-profile', authenticate, authController.getProfile);
router.post('/update-profile', authenticate, upload.single('image'), authController.updateProfile);

export default router;
