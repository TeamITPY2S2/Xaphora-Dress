// controllers/adminController.js
const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");

// Create a new admin (only accessible by super admin)
const createAdmin = async (req, res) => {
  const { firstName, lastName, email, password, adminType } = req.body;
  try {
    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      adminType,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        adminType: newAdmin.adminType,
      },
    });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAdmin,
};