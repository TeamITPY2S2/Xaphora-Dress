const Cart = require("../models/Cart");
const Order = require("../models/Order"); // if your order details are stored separately
const User = require("../models/UserModel"); // Ensure the casing matches your file

// Simulate a payment and award loyalty points
exports.payWithMock = async (req, res) => {
  const { cartId, userId } = req.body; // Ensure you send both cartId and userId

  try {
    // Retrieve the cart using the provided cartId
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    // Simulate payment processing delay (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mark the payment as completed on the cart
    cart.paymentStatus = "completed";
    await cart.save();
    
    // Award loyalty points to the user based on the cart's total price (1 point per $1)
    const user = await User.findById(userId);
    if (user) {
      const totalPrice = Number(cart.totalPrice) || 0;
      const pointsEarned = Math.floor(totalPrice);
      user.loyaltyPoints += pointsEarned;
      await user.save();
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Mock payment completed and loyalty points awarded",
      pointsAwarded: user ? Math.floor(Number(cart.totalPrice)) : 0
    });
  } catch (error) {
    console.error("Mock payment error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Use loyalty points to pay for an order
exports.payWithLoyalty = async (req, res) => {
  const { userId, orderId, pointsUsed } = req.body;

  try {
    // Retrieve the order by its ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Retrieve the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has enough loyalty points
    if (user.loyaltyPoints < pointsUsed) {
      return res.status(400).json({ error: "Insufficient loyalty points" });
    }

    // Deduct the points from the user's account
    user.loyaltyPoints -= pointsUsed;
    await user.save();

    // Mark the order as paid (adjust logic if needed)
    order.paymentStatus = "completed";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment completed using loyalty points",
      remainingPoints: user.loyaltyPoints
    });
  } catch (error) {
    console.error("Loyalty payment error:", error);
    return res.status(500).json({ error: error.message });
  }
};
