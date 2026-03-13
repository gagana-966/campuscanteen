import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// Register user
export const registerUser = async (req, res) => {
    const { name, email, password, role, restaurantName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        restaurantName: role === 'restaurant' ? restaurantName : undefined,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantName: user.restaurantName,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.role !== role) {
            return res.status(401).json({ message: `Please login as a ${user.role}` });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save the OTP directly
        user.loginOtp = otp;
        user.loginOtpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();

        // Send OTP via email
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.SMTP_FROM_EMAIL || `"Campus Canteen" <${process.env.SMTP_EMAIL}>`,
                to: user.email,
                subject: 'Your Login OTP - Campus Canteen',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333; text-align: center;">Campus Canteen Login</h2>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #007bff; margin-top: 0;">Your One-Time Password (OTP)</h3>
                            <p style="font-size: 18px; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0;">
                                ${otp}
                            </p>
                            <p style="margin-bottom: 0;">
                                This OTP will expire in <strong>5 minutes</strong>.
                            </p>
                            <p style="margin-bottom: 0;">
                                If you didn't request this login, please ignore this email.
                            </p>
                        </div>
                        <p style="color: #666; font-size: 12px; text-align: center;">
                            Campus Canteen - Secure Login System
                        </p>
                    </div>
                `,
                text: `Your login OTP is: ${otp}. It will expire in 5 minutes.`
            };

            await transporter.sendMail(mailOptions);
            console.log(`✅ OTP sent successfully to ${user.email}`);

        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            // do not expose OTP when email fails
            return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
        }

        return res.status(200).json({ otpRequired: true, message: 'OTP sent to your email successfully!' });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// Verify Login OTP
export const verifyLoginOtp = async (req, res) => {
    const { email, role, otp } = req.body;

    console.log(`Verifying OTP for ${email} with role ${role} and OTP ${otp} (type: ${typeof otp})`);

    const user = await User.findOne({
        email,
        role,
        loginOtp: otp,
        loginOtpExpire: { $gt: Date.now() }
    });
    console.log('User found during OTP verify?', user ? 'Yes' : 'No');

    if (user) {
        // Clear OTP fields
        user.loginOtp = undefined;
        user.loginOtpExpire = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantName: user.restaurantName,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid or expired OTP' });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset url
    // Assuming frontend is running on localhost:5173
    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_EMAIL || 'ethereal_user',
                pass: process.env.SMTP_PASSWORD || 'ethereal_pass',
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL || '"Campus Canteen" <noreply@campuscanteen.com>',
            to: user.email,
            subject: 'Password reset token',
            text: message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(500).json({ message: 'Email could not be sent' });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, token: generateToken(user._id) });
};
