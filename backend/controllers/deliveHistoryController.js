// controllers/deliveHistoryController.js
const Order = require('../models/Order');

// For customers: get delivery history for a specific customer
exports.getUserDeliveryHistory = async (req, res) => {
  try {
    // Assume the request provides a customerId in the URL params.
    const { customerId } = req.params;
    const orders = await Order.find({ customer: customerId });
    res.status(200).json({
      message: "User delivery history retrieved successfully",
      orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// For admin: get the complete delivery history (all orders)
exports.getAllDeliveryHistory = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      message: "All delivery history retrieved successfully",
      orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
