// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login, forgotPassword, resetPassword } = require("../controllers/authController");

// Universal login
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;