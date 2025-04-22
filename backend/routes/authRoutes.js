const express = require("express");
const router = express.Router();
const {
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const authMiddleware = require("../Middleware/authMiddleware");

// Public Routes
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected Route
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;