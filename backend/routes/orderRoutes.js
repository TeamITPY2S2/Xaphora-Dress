// server/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST create a new order
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentStatus, orderStatus } = req.body;

    // Create a new order using the provided data
    const order = new Order({
      userId,
      items,
      totalAmount,
      paymentStatus, // Optional: if not provided, default "pending" will be used.
      orderStatus    // Optional: if not provided, default "processing" will be used.
    });
    
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all orders (with optional population of user and product details)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")  // Populate user details (adjust fields as needed)
      .populate("items.productId", "name price"); // Populate product details
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single order by its _id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
