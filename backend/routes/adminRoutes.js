// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");

// GET all admins
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find({});
    return res.status(200).json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    return res.status(500).json({ message: "Error fetching admins" });
  }
});

// POST - Create a new admin
router.post("/", async (req, res) => {
  try {
    const { email, firstName, lastName, password, adminType } = req.body;
    
    // Optional: check if admin with same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const newAdmin = new Admin({ email, firstName, lastName, password, adminType });
    await newAdmin.save();

    return res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Error creating admin:", err);
    return res.status(500).json({ message: "Error creating admin" });
  }
});

module.exports = router;