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

// PUT - Update an existing admin
router.put("/:id", async (req, res) => {
  try {
    const { email, firstName, lastName, adminType } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.email = email || admin.email;
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.adminType = adminType || admin.adminType;

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
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await admin.remove();
    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    return res.status(500).json({ message: "Error deleting admin" });
  }
});

module.exports = router;