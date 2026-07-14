const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { 
  registerValidation, 
  loginValidation, 
  profileValidation, 
  passwordChangeValidation 
} = require('../middleware/validation');

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', protect, authController.getMe);

// Settings and Profile Routes
router.put('/profile', protect, profileValidation, authController.updateProfile);
router.put('/password', protect, passwordChangeValidation, authController.changePassword);
router.delete('/account', protect, authController.deleteAccount);

module.exports = router;
