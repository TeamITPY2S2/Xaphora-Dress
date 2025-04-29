const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Mock payment (awards loyalty points based on cart totalPrice)
router.post("/pay/mock", paymentController.payWithMock);

// Pay with loyalty points
router.post("/pay/loyalty", paymentController.payWithLoyalty);

module.exports = router;
