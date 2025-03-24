// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// Single login endpoint
router.post("/login", login);

module.exports = router;