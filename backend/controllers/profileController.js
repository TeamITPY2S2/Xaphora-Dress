// backend/controllers/profileController.js
const Admin = require("../models/adminModel");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    let updated;
    if (req.user.adminId) {
      updated = await Admin.findByIdAndUpdate(
        req.user.adminId,
        { firstName, lastName },
        { new: true }
      ).select("-password");
    } else if (req.user.userId) {
      updated = await User.findByIdAndUpdate(
        req.user.userId,
        { firstName, lastName },
        { new: true }
      ).select("-password");
    } else {
      return res.status(400).json({ message: "Invalid token payload" });
    }
    if (!updated) return res.status(404).json({ message: "Profile not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteProfile = async (req, res) => {
  try {
    let deleted;
    if (req.user.adminId) {
      deleted = await Admin.findByIdAndDelete(req.user.adminId);
    } else if (req.user.userId) {
      deleted = await User.findByIdAndDelete(req.user.userId);
    } else {
      return res.status(400).json({ message: "Invalid token payload" });
    }
    if (!deleted) return res.status(404).json({ message: "Profile not found" });
    return res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error("Delete profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfile, deleteProfile };