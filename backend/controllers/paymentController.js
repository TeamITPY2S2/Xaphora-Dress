const Cart = require("../models/Cart");
const Order = require("../models/OrderModel");
const CardInfo = require("../models/CardInfoModel");
const User = require("../models/UserModel");

// Simulate payment with mock payment (basic)
exports.payWithMock = async (req, res) => {
  const { userId } = req.body;

  try {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const orderDetails = JSON.parse(localStorage.getItem("latestOrder"));
    if (!orderDetails) {
      return res.status(400).json({ error: "No order details found" });
    }

    // Create new order
    const newOrder = new Order({
      userId: userId || null,
      customerName: orderDetails.customerName,
      shippingAddress: orderDetails.shippingAddress,
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: orderDetails.totalAmount,
      paymentMethod: "loyalty",
      paymentStatus: "completed"
    });

    const savedOrder = await newOrder.save();

    // Award loyalty points
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const pointsEarned = Math.floor(orderDetails.totalAmount);
        user.loyaltyPoints += pointsEarned;
        await user.save();
      }
    }

    // Clear localStorage cart after order
    localStorage.removeItem("cart");

    return res.status(201).json({
      message: "Order placed with mock payment!",
      order: savedOrder
    });

  } catch (error) {
    console.error("Mock payment error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Pay using Loyalty Points
exports.payWithLoyalty = async (req, res) => {
  const { userId, orderId, pointsUsed } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (user.loyaltyPoints < pointsUsed) {
      return res.status(400).json({ error: "Insufficient loyalty points" });
    }

    // Deduct points
    user.loyaltyPoints -= pointsUsed;
    await user.save();

    // Update order payment
    order.paymentMethod = "loyalty";
    order.paymentStatus = "completed";
    await order.save();

    return res.status(200).json({
      message: "Payment successful using loyalty points",
      order,
      remainingPoints: user.loyaltyPoints
    });

  } catch (error) {
    console.error("Loyalty Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Pay using Card Details
exports.payWithCard = async (req, res) => {
  const { customerName, shippingAddress, cartItems, totalAmount, cardNumber, expiryDate, userId } = req.body;

  try {
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "No items to checkout" });
    }

    // Create Order
    const newOrder = new Order({
      userId: userId || null,
      customerName,
      shippingAddress,
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      paymentMethod: "card",
      paymentStatus: "completed"
    });

    const savedOrder = await newOrder.save();

    // Save Card Info (only last 4 digits)
    const cardInfo = new CardInfo({
      customerName,
      cardLast4: cardNumber.slice(-4),
      expiryDate,
      orderId: savedOrder._id
    });

    await cardInfo.save();

    // Clear localStorage cart after payment
    localStorage.removeItem("cart");

    return res.status(201).json({
      message: "Payment successful with card!",
      order: savedOrder
    });

  } catch (error) {
    console.error("Card payment error:", error);
    res.status(500).json({ error: error.message });
  }
};
