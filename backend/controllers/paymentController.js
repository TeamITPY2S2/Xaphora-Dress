const Cart = require("../models/Cart");
const Order = require("../models/OrderModel");
const CardInfo = require("../models/CardInfoModel");
const User = require("../models/UserModel");

// Simulate payment with mock payment (basic)
exports.payWithMock = async (req, res) => {
  const { userId, cartItems, orderDetails } = req.body;

  try {
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

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
        price: item.price,
        imageUrl: item.imageUrl || "https://via.placeholder.com/150"
      })),
      totalAmount: orderDetails.totalAmount,
      paymentMethod: "loyalty",
      paymentStatus: "completed",
      status: "processing"
    });

    const savedOrder = await newOrder.save();

    // Award loyalty points
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const pointsEarned = Math.floor(orderDetails.totalAmount * 0.1); // 10% of total amount
        user.loyaltyPoints += pointsEarned;
        await user.save();
      }
    }

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
    order.status = "processing";
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

// Pay with Card
exports.payWithCard = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      shippingAddress,
      items,
      totalAmount,
      cardNumber,
      cardholderName,
      expiryDate,
      cvv,
      saveCardDetails,
      loyaltyPointsUsed = 0,
      loyaltyPointsEarned = 0
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items to checkout" });
    }

    // Create Order
    const newOrder = new Order({
      userId: userId || null,
      customerName,
      shippingAddress,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl || "https://via.placeholder.com/150"
      })),
      totalAmount,
      paymentMethod: "credit_card",
      paymentStatus: "completed",
      status: "processing",
      loyaltyPointsUsed,
      loyaltyPointsEarned
    });

    const savedOrder = await newOrder.save();

    // Save Card Info if requested (only last 4 digits)
    if (saveCardDetails && userId) {
      const cardInfo = new CardInfo({
        userId,
        customerName,
        cardNumber: cardNumber.slice(-4),
        cardholderName,
        expiryDate,
        orderId: savedOrder._id
      });

      try {
        await cardInfo.save();
        console.log("Card info saved successfully");
      } catch (cardError) {
        console.error("Error saving card info:", cardError);
        // Continue with the order even if card saving fails
      }
    }

    // Update user's loyalty points if applicable
    if (userId && (loyaltyPointsUsed > 0 || loyaltyPointsEarned > 0)) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.loyaltyPoints = (user.loyaltyPoints || 0) - loyaltyPointsUsed + loyaltyPointsEarned;
          await user.save();
        }
      } catch (pointsError) {
        console.error("Error updating loyalty points:", pointsError);
        // Continue with the order even if points update fails
      }
    }

    // Prepare order details for response
    const orderDetails = {
      orderId: savedOrder._id,
      customerName: savedOrder.customerName,
      shippingAddress: savedOrder.shippingAddress,
      items: savedOrder.items,
      subtotal: savedOrder.totalAmount - (savedOrder.shippingFee || 0),
      shippingFee: savedOrder.shippingFee || 0,
      totalAmount: savedOrder.totalAmount,
      paymentMethod: savedOrder.paymentMethod,
      paymentStatus: savedOrder.paymentStatus,
      status: savedOrder.status,
      loyaltyPoints: {
        used: savedOrder.loyaltyPointsUsed || 0,
        earned: savedOrder.loyaltyPointsEarned || 0
      },
      createdAt: savedOrder.createdAt
    };

    return res.status(201).json({
      message: "Payment successful with card!",
      order: orderDetails
    });

  } catch (error) {
    console.error("Card Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};
