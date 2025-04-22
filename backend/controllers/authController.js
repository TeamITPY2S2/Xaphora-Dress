const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const User = require("../models/UserModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Send Reset Email
const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    from: "support@xaphoradress.com",
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Admin.findOne({ email }) || await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("this is user pw - ",password);
    console.log("this is hash - " , user.password);
    const userPWHash = await bcrypt.hash(password , 10);
    console.log("hash for givrn val" , userPWHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = user.adminType
      ? { adminId: user._id, adminType: user.adminType }
      : { userId: user._id, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    const userType = user.adminType ? "admin" : "user";
    res.status(200).json({ token, userType, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await Admin.findOne({ email }) || await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendResetEmail(email, token);
    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    let user = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }) || await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });
    console.log(password);
    console.log(user.password);
    // const salt = await bcrypt.genSalt(10);
    const userPWHash = await bcrypt.hash(password, 10);
    user.password = userPWHash;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword
};