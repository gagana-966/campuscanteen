import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

async function testOTP() {
    try {
        const email = 'gshree878@gmail.com';
        const role = 'customer';

        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found!');
            process.exit(1);
        }

        console.log('User found:', user.email);

        // 1. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.loginOtp = otp;
        user.loginOtpExpire = Date.now() + 5 * 60 * 1000;
        await user.save();
        console.log('OTP Saved:', otp, 'Expires:', new Date(user.loginOtpExpire));

        // Let's actually check the DB immediately to see what happened
        const checkUser = await User.findById(user._id);
        console.log('Saved directly in DB?');
        console.log('-- loginOtp:', checkUser.loginOtp);
        console.log('-- loginOtpExpire:', checkUser.loginOtpExpire);

        // 2. Verify OTP
        const verifyUser = await User.findOne({
            email,
            role,
            loginOtp: otp,
            loginOtpExpire: { $gt: Date.now() }
        });

        if (verifyUser) {
            console.log('✅ Verification Successful!');
            // Clear OTP fields
            verifyUser.loginOtp = undefined;
            verifyUser.loginOtpExpire = undefined;
            await verifyUser.save();
        } else {
            console.log('❌ Verification failed. Query returned nothing.');
            console.log('Query parameters used:');
            console.log('email:', email);
            console.log('role:', role);
            console.log('loginOtp:', otp);
            console.log('Date.now():', Date.now());
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

testOTP();
