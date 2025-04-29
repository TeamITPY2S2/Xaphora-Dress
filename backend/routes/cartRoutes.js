const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Create a new cart
router.post("/", cartController.createCart);

// Get all carts
router.get("/", cartController.getAllCarts);

// Get a cart by ID
router.get("/:cartId", cartController.getCartById);

// ✅ Get a cart by userId (new route)
router.get("/user/:userId", cartController.getUserCart);

// Update a cart by ID
router.put("/:id", cartController.updateCart);

// Delete a cart by ID
router.delete("/:id", cartController.deleteCart);

module.exports = router;
