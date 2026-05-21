const { Router } = require('express');
const { authenticate } = require('@/middleware/auth');
const upload = require('@/middleware/upload.middleware');
const { authLimiter } = require('@/middleware/rateLimiter');
const authController = require('./auth.controller');

const router = Router();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/get-profile', authenticate, authController.getProfile);
router.post('/update-profile', authenticate, upload.single('image'), authController.updateProfile);

module.exports = router;
