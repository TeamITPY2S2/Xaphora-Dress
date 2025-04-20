
const Order = require('../models/Order');

// get delivery history for a specific customer
exports.getUserDeliveryHistory = async (req, res) => {
  try {
    
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

// get the complete delivery history 
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
