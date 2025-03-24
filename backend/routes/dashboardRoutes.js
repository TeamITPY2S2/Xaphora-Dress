// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwtMiddleware");
const { getDashboardData } = require("../controllers/dashboardController");
const { updateProfile, deleteProfile } = require("../controllers/profileController");

// Universal dashboard for both admin and user tokens
router.get("/", verifyToken, getDashboardData);

// Update profile
router.put("/update", verifyToken, updateProfile);

// Delete profile
router.delete("/delete", verifyToken, deleteProfile);

module.exports = router;