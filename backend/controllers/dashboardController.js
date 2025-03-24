// controllers/dashboardController.js
const Admin = require("../models/adminModel");
const User = require("../models/UserModel");

const getDashboardData = async (req, res) => {
  try {
    // If it's an admin
    if (req.user.adminId) {
      const admin = await Admin.findById(req.user.adminId).select("-password");
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      // Return something
      return res.json({
        userType: admin.adminType === "super-admin" ? "super-admin" : "admin",
        firstName: admin.firstName,
        lastName: admin.lastName,
        // etc.
      });
    }

    // If it's a user
    if (req.user.userId) {
      const user = await User.findById(req.user.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({
        userType: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        // etc.
      });
    }

    return res.status(400).json({ message: "Invalid token payload" });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardData };