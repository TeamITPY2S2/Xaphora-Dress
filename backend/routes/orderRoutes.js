const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

// ✅ Create a new order (fix userId cast)
router.post('/', async (req, res) => {
  try {
    let { userId, customerName, shippingAddress, items, totalAmount } = req.body;

    // Validate and convert userId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    userId = new mongoose.Types.ObjectId(userId);

    const newOrder = new Order({
      userId,
      customerName,
      shippingAddress,
      items,
      totalAmount
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all orders with region extracted from nested shippingAddress.address
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();

    const ordersWithRegion = orders.map(order => {
      const orderObj = order.toObject();

      const addressStr = orderObj.shippingAddress?.address || '';
      let shippingRegion = 'Unknown';

      const parts = addressStr.split(',').map(p => p.trim());

      if (parts.length >= 2) {
        const secondLast = parts[parts.length - 2];
        const last = parts[parts.length - 1];

        if (/\d{3,}/.test(last)) {
          shippingRegion = secondLast;
        } else {
          shippingRegion = last;
        }
      }

      return {
        ...orderObj,
        shippingRegion
      };
    });

    res.status(200).json(ordersWithRegion);
  } catch (error) {
    console.error('Error fetching orders:', error);
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
