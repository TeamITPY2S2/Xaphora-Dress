const nodemailer = require('nodemailer');

// Create reusable transporter object
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // For development only
    }
  });
};

// Send email function with error handling
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    
    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

// Password reset email template
const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `http://localhost:3000/reset-password/${token}`;
  
  const html = `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; font-size: 16px; border-radius: 5px;">
          Reset Password
        </a>
      </div>

      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p style="color: gray; font-size: 12px;">This link will expire in 5 minutes.</p>

      <hr style="margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #999;">Xaphora Dress Team</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: html
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail
}; 