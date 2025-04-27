// controllers/orderController.js

const Order = require("../models/OrderModel");

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod, // ✅ MUST destructure it
      status,
      paymentStatus
    } = req.body;

    const newOrder = new Order({
      userId,
      customerName,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod, // ✅ MUST SAVE IT
      status,
      paymentStatus
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};
