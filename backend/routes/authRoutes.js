// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// Universal login
router.post("/api/auth/login", login);

module.exports = router;