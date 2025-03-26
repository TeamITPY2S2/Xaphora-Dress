const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");

// Get or create cart for the authenticated user
router.get("/", authenticateToken, cartController.getOrCreateCart);

// Get a cart by ID
router.get("/:cartId", authenticateToken, cartController.getCartById);

// Update a cart by ID
router.put("/:id", authenticateToken, cartController.updateCart);

// Delete a cart by ID
router.delete("/:id", authenticateToken, cartController.deleteCart);

module.exports = router;
