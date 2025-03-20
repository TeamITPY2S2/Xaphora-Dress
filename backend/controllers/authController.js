const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create a super admin (only if one does not already exist)
const createSuperAdmin = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingSuperAdmin = await User.findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return res
        .status(400)
        .json({ message: "Super admin already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "super-admin",
    });
    await superAdmin.save();
    res.status(201).json({
      message: "Super admin created successfully",
      user: {
        id: superAdmin._id,
        email: superAdmin.email,
        role: superAdmin.role,
      },
    });
  } catch (err) {
    console.error("Error creating super admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Super admin login
const superAdminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, role: "super-admin" });
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed: Super admin not found.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Authentication failed: Invalid credentials." });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Super admin login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Super admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createSuperAdmin, superAdminLogin };