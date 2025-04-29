// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const { updateOrderStatus } = require('../controllers/deliveStatusController');
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
      status: status || 'ordered',
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
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders for a specific user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// Update order details (admin and order-management only)
router.put('/:id', orderManagementAuth, async (req, res) => {
  try {
    const {
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

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update only the fields that are provided
    if (customerName) order.customerName = customerName;
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (items) order.items = items;
    if (totalAmount) order.totalAmount = totalAmount;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (loyaltyPointsUsed !== undefined) order.loyaltyPointsUsed = loyaltyPointsUsed;
    if (loyaltyPointsEarned !== undefined) order.loyaltyPointsEarned = loyaltyPointsEarned;

    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order item details (size, quantity)
router.put('/:orderId/items/:itemId', auth, orderController.updateOrderItem);

// Confirm order delivery (buyer only)
router.put('/:orderId/confirm-delivery', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the authenticated user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to confirm this order' });
    }

    // Update order status to delivered
    order.status = 'delivered';
    await order.save();
    
    res.json({ message: 'Order confirmed as delivered', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an order (admin and order-management only)
router.delete('/:id', orderManagementAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
