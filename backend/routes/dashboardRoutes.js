const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwtMiddleware");

const {
  getDashboardData,
  getRoleBasedDashboardInfo,
} = require("../controllers/dashboardController");

const {
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

// For logged-in user dashboard info (name, type)
router.get("/", verifyToken, getRoleBasedDashboardInfo);

// For super-admin to get system-wide stats
router.get("/superadmin/stats", verifyToken, getDashboardData);

// Profile update/delete
router.put("/profile/update", verifyToken, updateProfile);
router.delete("/profile/delete", verifyToken, deleteProfile);

module.exports = router;