const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Create a new cart
router.post("/", cartController.createCart);

// Get all carts (this fixes the 404 for GET /api/cart)
router.get("/", cartController.getAllCarts);

// Get a specific cart by ID
router.get("/:id", cartController.getCartById);

// Update a cart by ID
router.put("/:id", cartController.updateCart);

// Delete a cart by ID
router.delete("/:id", cartController.deleteCart);

module.exports = router;
