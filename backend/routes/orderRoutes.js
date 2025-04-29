// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const auth = require('../middleware/auth');
const orderManagementAuth = require('../middleware/orderManagementAuth');
const orderController = require('../controllers/OrderController');

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const {
      userId,
      customerName,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod,
      status,
      paymentStatus,
      loyaltyPointsUsed,
      loyaltyPointsEarned
    } = req.body;

    // Validate required fields
    if (!customerName || !shippingAddress || !items || !totalAmount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new order
    const newOrder = new Order({
      userId: userId || req.user._id, // Use authenticated user's ID if not provided
      customerName,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod,
      status: status || 'processing',
      paymentStatus: paymentStatus || 'completed',
      loyaltyPointsUsed: loyaltyPointsUsed || 0,
      loyaltyPointsEarned: loyaltyPointsEarned || 0
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin and order-management only)
router.get('/', orderManagementAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's orders
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific order by ID
router.get('/:orderId', auth, async (req, res) => {
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

// Update order status (admin and order-management only)
router.put('/:id/status', orderManagementAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order item details (size, quantity)
router.put('/:orderId/items/:itemId', auth, orderController.updateOrderItem);

module.exports = router;
