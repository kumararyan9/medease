const { Router } = require('express');
const { authenticate } = require('@/middleware/auth');
const upload = require('@/middleware/upload.middleware');
const authController = require('./auth.controller');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/get-profile', authenticate, authController.getProfile);
router.post('/update-profile', authenticate, upload.single('image'), authController.updateProfile);

module.exports = router;
