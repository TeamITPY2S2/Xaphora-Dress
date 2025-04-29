// controllers/orderController.js

const Order = require("../models/OrderModel");
const User = require("../models/UserModel");

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
      paymentStatus,
      loyaltyPointsUsed,
      loyaltyPointsEarned
    } = req.body;

    const newOrder = new Order({
      userId,
      customerName,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod, // ✅ MUST SAVE IT
      status,
      paymentStatus,
      loyaltyPointsUsed,
      loyaltyPointsEarned
    });

    const savedOrder = await newOrder.save();

    // Update user's loyalty points if userId is provided
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Deduct used points and add earned points
        user.loyaltyPoints = (user.loyaltyPoints || 0) - (loyaltyPointsUsed || 0) + (loyaltyPointsEarned || 0);
        await user.save();
      }
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update order item details (size, quantity)
exports.updateOrderItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { size, quantity } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the item in the order
    const itemIndex = order.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in order" });
    }

    // Update the item
    if (size) order.items[itemIndex].size = size;
    if (quantity) order.items[itemIndex].quantity = quantity;

    // Recalculate total amount
    order.totalAmount = order.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Save the updated order
    await order.save();

    res.status(200).json({
      message: "Order item updated successfully",
      order
    });
  } catch (error) {
    console.error("Update Order Item Error:", error);
    res.status(500).json({ error: error.message });
  }
};
