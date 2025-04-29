const express = require("express");
const router = express.Router();
const cardInfoController = require("../controllers/cardInfoController");

// Create a new card info
router.post("/", cardInfoController.createCardInfo);

// Get all cards for a user
router.get("/user/:userId", cardInfoController.getUserCards);

// Get a single card by ID
router.get("/:cardId", cardInfoController.getCardById);

// Update a card by ID
router.put("/:cardId", cardInfoController.updateCardInfo);

// Delete a card by ID
router.delete("/:cardId", cardInfoController.deleteCardInfo);

module.exports = router;
