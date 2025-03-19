const express = require("express");
const router = express.Router();

// Import Auth Controller functions
const { createSuperAdmin, superAdminLogin } = require("./controllers/authController");

// Route to create the super admin (one time use)
router.post("/superadmin/create", createSuperAdmin);

// Route for super admin login
router.post("/superadmin/login", superAdminLogin);

module.exports = router;