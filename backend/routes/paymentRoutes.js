const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Use the mock payment route
router.post("/pay/mock", paymentController.mockPayment);

module.exports = router;
