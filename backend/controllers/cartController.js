const Cart = require("../models/Cart");

// Create a new cart
exports.createCart = async (req, res) => {
  try {
    const { userId, items } = req.body;
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const cart = new Cart({ userId, items });
    await cart.save();
    res.status(201).json({ cart });
  } catch (err) {
    console.error("Error in createCart:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get a cart by its ID
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ cart });
  } catch (err) {
    console.error("Error in getCartById:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get all carts
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({ carts });
  } catch (err) {
    console.error("Error in getAllCarts:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update a cart by its ID
exports.updateCart = async (req, res) => {
  try {
    const { userId, items } = req.body;
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    if (userId) cart.userId = userId;
    if (items) cart.items = items;
    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    console.error("Error in updateCart:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete a cart by its ID
exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    console.error("Error in deleteCart:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
