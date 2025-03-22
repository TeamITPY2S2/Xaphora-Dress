const express = require("express");
const router = express.Router();
const infoController = require("../controllers/infoController");

// Create a new card info
router.post("/", infoController.createCardInfo);

// Get all cards for a user
router.get("/user/:userId", infoController.getUserCards);

// Get a single card by ID
router.get("/:cardId", infoController.getCardById);

// Update a card by ID
router.put("/:cardId", infoController.updateCardInfo);

// Delete a card by ID
router.delete("/:cardId", infoController.deleteCardInfo);

module.exports = router;
