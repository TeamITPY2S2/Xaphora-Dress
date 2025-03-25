// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    // Return all admins with createdAt fields
    const admins = await Admin.find({});
    return res.status(200).json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    return res.status(500).json({ message: "Error fetching admins" });
  }
});

// GET single admin by ID
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json(admin);
  } catch (err) {
    console.error("Error fetching admin:", err);
    return res.status(500).json({ message: "Error fetching admin" });
  }
});

// POST - Create a new admin
router.post("/", async (req, res) => {
  try {
    const { email, firstName, lastName, password, adminType } = req.body;

    // Check if email is already used
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create the admin
    const newAdmin = new Admin({
      email,
      firstName,
      lastName,
      password,
      adminType
    });

    await newAdmin.save();
    return res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Error creating admin:", err);
    return res.status(500).json({ message: "Error creating admin" });
  }
});

// PUT - Update an existing admin
router.put("/:id", async (req, res) => {
  try {
    const { email, firstName, lastName, adminType, password } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.email = email || admin.email;
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.adminType = adminType || admin.adminType;

    if (password) {
      // If password is updated, hash it
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    return res.status(200).json({ message: "Admin updated successfully" });
  } catch (err) {
    console.error("Error updating admin:", err);
    return res.status(500).json({ message: "Error updating admin" });
  }
});

// DELETE - Remove an admin
router.delete("/:id", async (req, res) => {
  try {
    // Using findByIdAndDelete to delete the admin
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    return res.status(500).json({ 
      message: "Error deleting admin", 
      error: err.message 
    });
  }
});

module.exports = router;