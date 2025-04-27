const CardInfo = require("../models/CardInfoModel");

// Create a new card info
exports.createCardInfo = async (req, res) => {
  try {
    const newCardInfo = new CardInfo(req.body);
    const savedCardInfo = await newCardInfo.save();
    res.status(201).json(savedCardInfo);
  } catch (error) {
    console.error("Error creating card info:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all cards for a user
exports.getUserCards = async (req, res) => {
  try {
    const { userId } = req.params;
    const cards = await CardInfo.find({ userId });
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching user cards:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single card by ID
exports.getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await CardInfo.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a card by ID
exports.updateCardInfo = async (req, res) => {
  try {
    const { cardId } = req.params;
    const updatedCard = await CardInfo.findByIdAndUpdate(cardId, req.body, { new: true });
    if (!updatedCard) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error updating card info:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a card by ID
exports.deleteCardInfo = async (req, res) => {
  try {
    const { cardId } = req.params;
    const deletedCard = await CardInfo.findByIdAndDelete(cardId);
    if (!deletedCard) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card info:", error);
    res.status(500).json({ error: error.message });
  }
};
