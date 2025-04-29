const express = require("express");
const router = express.Router();
const {
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../Middleware/authMiddleware");

// Public Routes
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected Route
router.put("/change-password", authMiddleware, changePassword);

// Universal login
router.post("/api/auth/login", login);

// Admin login route
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const Admin = require("../models/adminModel");
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, adminType: admin.adminType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Determine userType based on adminType
    const userType = admin.adminType === 'super-admin' ? 'super-admin' : 'admin';

    // Send response
    res.json({
      token,
      userType,
      user: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        adminType: admin.adminType
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;