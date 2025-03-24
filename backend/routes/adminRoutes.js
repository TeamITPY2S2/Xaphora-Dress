// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/jwtMiddleware");
const allowRoles = require("../Middleware/roleMiddleware");

const { createAdmin } = require("../controllers/adminController");

// Only super admin (adminType: "super-admin") is allowed to create new admins.
router.post("/create", verifyToken, allowRoles("super-admin"), createAdmin);

module.exports = router;