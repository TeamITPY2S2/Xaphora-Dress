// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel"); // Ensure correct path
// If you have token or role checks, import them
// const verifyToken = require("../middleware/jwtMiddleware");
// const allowRoles = require("../middleware/roleMiddleware");

/**
 * POST /api/admins
 * Create a new admin
 */
router.post("/", async (req, res) => {
  try {
    const { email, firstName, lastName, password, adminType } = req.body;
    // Create a new admin document
    const newAdmin = new Admin({ email, firstName, lastName, password, adminType });
    await newAdmin.save();
    return res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ message: "Error creating admin" });
  }
});

module.exports = router;