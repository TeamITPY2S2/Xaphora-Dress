const express = require("express");
const router = express.Router();

const { createSuperAdmin, superAdminLogin } = require("../controllers/AuthController");

// GET endpoint to verify that the auth route is active
router.get("/", (req, res) => {
  res.send("Auth endpoint is active");
});

// Route to create the super admin (one time use)
router.post("/superadmin/create", createSuperAdmin);

// Route for super admin login
router.post("/superadmin/login", superAdminLogin);

module.exports = router;