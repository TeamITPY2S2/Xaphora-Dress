// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { createSuperAdmin, universalLogin } = require("../controllers/authController");

// Optional test endpoint
router.get("/", (req, res) => {
  res.send("Auth endpoint is active");
});

// Create super admin (only one super admin allowed)
router.post("/superadmin/create", createSuperAdmin);

// Universal login for all roles (admins, buyers, sellers, etc.)
router.post("/login", universalLogin);

module.exports = router;