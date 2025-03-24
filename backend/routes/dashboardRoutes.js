// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwtMiddleware");
// If you want both admin and user dashboards, you might not do a role check here.

const { getDashboardData } = require("../controllers/dashboardController");

router.get("/", verifyToken, getDashboardData);

module.exports = router;