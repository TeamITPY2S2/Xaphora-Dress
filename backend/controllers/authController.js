// backend/controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const User = require("../models/UserModel");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService");

/**
 * Login handler: checks Admin first, then User;
 * compares password, returns JWT + userType.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1) Lookup admin or user
    let user = await Admin.findOne({ email });
    let userType = "admin";

    if (!user) {
      user = await User.findOne({ email });
      userType = "user";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4) Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Set userType based on adminType for admin users
    if (userType === "admin") {
      if (user.adminType === "super-admin") {
        userType = "super-admin";
      } else if (user.adminType === "order-management") {
        userType = "order-management";
      }
    }

    // 5) Build JWT payload
    const payload = userType === "admin" || userType === "super-admin" || userType === "order-management"
      ? { adminId: user._id, adminType: user.adminType }
      : { userId: user._id, role: user.role };

    // 6) Sign & return
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({ token, userType, user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Forgot password: generates a token, saves on user doc, emails link.
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user in either Admin or User collection
    const user = await Admin.findOne({ email }) || await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate and save reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 300000; // 5 minutes
    await user.save();

    try {
      // Send email using the new email service
      await sendPasswordResetEmail(email, token);
      return res.json({ message: "Password reset link sent to your email" });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({ message: "Failed to send reset email" });
    }
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Reset password: verifies token + expiry, updates password.
 */
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user with valid token in either collection
    const user = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }) || await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password & clear reset fields
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Change password for authenticated users: checks oldPassword, updates.
 */
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const userId = req.user?.adminId || req.user?.userId;
    const user = await Admin.findById(userId) || await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};
