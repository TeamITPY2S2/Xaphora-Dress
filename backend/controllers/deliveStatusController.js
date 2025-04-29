// controllers/deliveStatusController.js

const Order = require('../models/OrderModel');
const UserModel = require('../models/UserModel');
const { sendOrderEmail } = require('../utils/mailer');


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log('Updating order status:', { orderId, status });
    
    const validStatuses = ['Ordered', 'Packed', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      console.error('Invalid status provided:', status);
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order updated successfully:', order);

    // Get user details for email
    const user = await UserModel.findById(order.userId);
    console.log('Found user for email:', user);
    
    if (user) {
      const emailResult = await sendOrderEmail(order, user);
      console.log('Email send result:', emailResult);
    } else {
      console.error('User not found for order:', order.userId);
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Full error in updateOrderStatus:', error);
    res.status(500).json({ error: error.message });
  }
};
