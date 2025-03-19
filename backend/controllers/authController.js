// controllers/AuthController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Create a super admin (only if one does not already exist)
const createSuperAdmin = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Check if a super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super-admin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super admin already exists." });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the super admin user with a hashed password
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
    console.log("Login attempt for email:", email);

    // Find the super admin by email and role
    const user = await User.findOne({ email, role: "super-admin" });
    if (!user) {
      console.error("No super admin found for email:", email);
      return res.status(401).json({ message: "Authentication failed: Super admin not found." });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Password mismatch for email:", email);
      return res.status(401).json({ message: "Authentication failed: Invalid credentials." });
    }

    // Generate a JWT token with the user ID and role
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

module.exports = {
  createSuperAdmin,
  superAdminLogin,
};