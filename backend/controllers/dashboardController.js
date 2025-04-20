const Admin = require("../models/adminModel");
const Seller = require("../models/Seller");
const User = require("../models/UserModel"); // Includes buyers

// ✅ Used by /api/dashboard for all roles
const getRoleBasedDashboardInfo = async (req, res) => {
  try {
    if (req.user && req.user.adminId) {
      const admin = await Admin.findById(req.user.adminId).select("-password");
      if (!admin) return res.status(404).json({ message: "Admin not found" });

      return res.json({
        userType: admin.adminType === "super-admin" ? "super-admin" : "admin",
        firstName: admin.firstName,
        lastName: admin.lastName,
      });
    }

    if (req.user && req.user.userId) {
      const user = await User.findById(req.user.userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.json({
        userType: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }

    if (req.user && req.user.sellerId) {
      const seller = await Seller.findById(req.user.sellerId).select("-password");
      if (!seller) return res.status(404).json({ message: "Seller not found" });

      return res.json({
        userType: "seller",
        firstName: seller.firstName,
        lastName: seller.lastName,
      });
    }

    return res.status(400).json({ message: "Invalid token payload" });
  } catch (error) {
    console.error("Error fetching role-based dashboard info:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Used by /api/dashboard/superadmin/stats to get counts
const getDashboardData = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    const sellerCount = await Seller.countDocuments();
    const buyerCount = await User.countDocuments({ role: "buyer" });

    res.status(200).json({
      adminCount,
      sellerCount,
      buyerCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardData,
  getRoleBasedDashboardInfo,
};