const mongoose = require("mongoose");
const Cart = require("../models/Cart");

// Create a new cart
exports.createCart = async (req, res) => {
  try {
    const { userId, items, totalPrice } = req.body;

    // Optional: compute totalPrice if not provided
    let computedTotal = 0;
    if (items && items.length > 0) {
      computedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Use the provided totalPrice or the computed total
    const finalPrice = totalPrice || computedTotal;

    const newCart = new Cart({
      userId: mongoose.Types.ObjectId(userId), // Ensure userId is an ObjectId
      items,
      totalPrice: finalPrice
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    console.error("Error creating cart:", err);
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
exports.getCartById = async (req, res) => {
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
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params; // route param is :id
    const updates = req.body;

    // If userId is present, ensure it’s an ObjectId
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
exports.deleteCart = async (req, res) => {
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
