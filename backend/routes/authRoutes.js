const express = require("express");
const router = express.Router();
const { createSuperAdmin, superAdminLogin } = require("../controllers/AuthController");

// (Optional) Test endpoint
router.get("/", (req, res) => {
  res.send("Auth endpoint is active");
});

// Super admin creation and login routes
router.post("/superadmin/create", createSuperAdmin);
router.post("/superadmin/login", superAdminLogin);

module.exports = router;