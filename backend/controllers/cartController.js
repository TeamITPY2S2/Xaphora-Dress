const Cart = require("../models/Cart");

// Create or Update Cart
exports.createCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing userId or cart items." });
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      // Update existing cart
      existingCart.items = items;
      existingCart.totalPrice = totalPrice;
      existingCart.paymentStatus = "pending";
      const updatedCart = await existingCart.save();
      return res.status(200).json(updatedCart);
    } else {
      // Create new cart
      const newCart = new Cart({
        userId,
        items,
        totalPrice,
        paymentStatus: "pending"
      });
      const savedCart = await newCart.save();
      return res.status(201).json(savedCart);
    }
  } catch (error) {
    console.error("Error creating or updating cart:", error);
    res.status(500).json({ error: "Failed to create or update cart." });
  }
};

// Get all carts
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ error: "Failed to fetch carts." });
  }
};

// Get a cart by cartId
exports.getCartById = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart by ID:", error);
    res.status(500).json({ error: "Failed to fetch cart." });
  }
};

// ✅ Get a cart by userId
exports.getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found for this user." });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart by user:", error);
    res.status(500).json({ error: "Failed to fetch cart." });
  }
};

// Update a cart by ID
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart." });
  }
};

// Delete a cart by ID
exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(id);

    if (!deletedCart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    res.status(200).json({ message: "Cart deleted successfully." });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ error: "Failed to delete cart." });
  }
};
