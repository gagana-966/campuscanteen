import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL || 'test@example.com',
    to: 'test@example.com',
    subject: 'Test Email',
    text: 'This is a test email'
};

async function testEmail() {
    try {
        console.log('Sending email with config:');
        console.log('Host: ', process.env.SMTP_HOST);
        console.log('User: ', process.env.SMTP_EMAIL);
        console.log('From: ', process.env.SMTP_FROM_EMAIL);
        let info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: ', info.messageId);
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        console.error(error);
    }
}

testEmail();
