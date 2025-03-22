const Admin = require("../models/addAdminModel");
const bcrypt = require("bcryptjs");

// Create a new admin
const createAdmin = async (req, res, next) => {
  const { firstName, lastName, email, password, adminType } = req.body;
  try {
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

// Get all admins (excluding passwords)
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select("-password");
    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "No admins found." });
    }
    res.status(200).json({ admins });
  } catch (err) {
    console.error("Error retrieving admins:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single admin by ID (person details only)
const getAdminById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(200).json({ admin });
  } catch (err) {
    console.error("Error retrieving admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an admin by ID
const updateAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, adminType } = req.body;
  try {
    const updateData = { firstName, lastName, email, adminType };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(200).json({
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an admin by ID
const deleteAdmin = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};