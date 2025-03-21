// controllers/authController.js
const Admin = require("../models/AdminModel");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create super admin (only if one does not exist)
// This endpoint is for initial setup only.
const createSuperAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Check if a super admin exists in the Admin collection
    const existingSuperAdmin = await Admin.findOne({ adminType: "super-admin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin with adminType "super-admin"
    const superAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      adminType: "super-admin",
    });

    await superAdmin.save();

    res.status(201).json({
      message: "Super admin created successfully",
      admin: {
        id: superAdmin._id,
        email: superAdmin.email,
        adminType: superAdmin.adminType,
      },
    });
  } catch (err) {
    console.error("Error creating super admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Universal login for all roles (admins, buyers, sellers)
// Checks the Admin collection first; if not found, checks the User collection.
const universalLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check in the Admin collection first.
    let admin = await Admin.findOne({ email });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      const token = jwt.sign(
        { adminId: admin._id, adminType: admin.adminType },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        message: "Login successful (admin)",
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          adminType: admin.adminType,
        },
      });
    }

    // If not an admin, check in the User collection.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "Login successful (user)",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSuperAdmin,
  universalLogin,
};