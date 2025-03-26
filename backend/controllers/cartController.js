const mongoose = require("mongoose");
const Cart = require("../models/Cart");

// Get or create cart for a user
const getOrCreateCart = async (req, res) => {
  try {
    console.log('Request user:', req.user); // Debug log
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    console.log('User ID:', userId); // Debug log

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log('Creating new cart for user:', userId); // Debug log
      // Create a new cart if one doesn't exist
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0
      });
      await cart.save();
      console.log('New cart created:', cart); // Debug log
    }

    // Log the cart data for debugging
    console.log('Cart data:', cart);

    // Return the cart with all fields
    res.status(200).json({
      _id: cart._id.toString(), // Convert ObjectId to string
      userId: cart.userId.toString(), // Convert ObjectId to string
      items: cart.items || [],
      totalPrice: cart.totalPrice || 0
    });
  } catch (err) {
    console.error("Error getting/creating cart:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all carts
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    console.error("Error fetching carts:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get a cart by ID
const getCartById = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a cart by ID
const updateCart = async (req, res) => {
  try {
    const { id } = req.params; // route param is :id
    const updates = req.body;

    // If userId is present, ensure it's an ObjectId
    if (updates.userId) {
      updates.userId = mongoose.Types.ObjectId(updates.userId);
    }

    const updatedCart = await Cart.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a cart by ID
const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(id);
    if (!deletedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    console.error("Error deleting cart:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOrCreateCart,
  getCartById,
  updateCart,
  deleteCart
};
