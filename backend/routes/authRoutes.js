import express from 'express';
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    verifyLoginOtp,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-login-otp', verifyLoginOtp);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
