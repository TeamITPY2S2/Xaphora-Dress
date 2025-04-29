const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwtMiddleware");

const { updateProfile, deleteProfile } = require("../controllers/profileController");

const {
  getDashboardData,
  getRoleBasedDashboardInfo,
  getDeliveryDashboardData
} = require("../controllers/dashboardController");

// Delivery dashboard data
router.get("/delivery", verifyToken, getDeliveryDashboardData);

// Update profile
router.put("/update", verifyToken, updateProfile);

// For logged-in user dashboard info (name, type)
router.get("/", verifyToken, getRoleBasedDashboardInfo);

// For super-admin to get system-wide stats
router.get("/superadmin/stats", verifyToken, getDashboardData);

// Profile update/delete
router.delete("/profile/delete", verifyToken, deleteProfile);

module.exports = router;
