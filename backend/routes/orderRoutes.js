// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { updateOrderStatus } = require('../controllers/deliveStatusController');

// Get order statistics
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    
    res.status(200).json({
      totalOrders,
      deliveredOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent orders
router.get('/recent', async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id customerName status createdAt');
    
    res.status(200).json(recentOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new order using the updated Order model fields
router.post('/', async (req, res) => {
  try {
    // Expecting new field names from the updated Order model
    const { userId, customerName, shippingAddress, items, totalAmount } = req.body;
    const newOrder = new Order({ userId, customerName, shippingAddress, items, totalAmount });
    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
