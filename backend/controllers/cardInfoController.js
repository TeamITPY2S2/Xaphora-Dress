const CardInfo = require("../models/CardInfoModel");

// Create a new card info
exports.createCardInfo = async (req, res) => {
  try {
    const {
      userId,
      orderId,
      cardNumber,
      cardLast4,
      cardholderName,
      customerName,
      expiryDate,
      cvv,
      saveCardDetails
    } = req.body;

    console.log("Received card info request:", {
      userId,
      orderId,
      cardNumber: cardNumber ? "****" + cardNumber.slice(-4) : undefined,
      cardLast4,
      cardholderName,
      customerName,
      expiryDate,
      cvv: cvv ? "***" : undefined,
      saveCardDetails
    });

    // Validate required fields
    if (!userId || !cardNumber || !cardholderName || !expiryDate || !cvv) {
      console.error("Missing required fields:", { userId, cardNumber: !!cardNumber, cardholderName, expiryDate, cvv: !!cvv });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new card info document
    const newCardInfo = new CardInfo({
      userId,
      orderId,
      cardNumber,
      cardLast4: cardLast4 || cardNumber.slice(-4),
      cardholderName,
      customerName: customerName || cardholderName,
      expiryDate,
      cvv,
      saveCardDetails: saveCardDetails !== undefined ? saveCardDetails : true
    });

    console.log("Attempting to save card info...");
    const savedCardInfo = await newCardInfo.save();
    console.log("Card info saved successfully:", savedCardInfo._id);
    res.status(201).json(savedCardInfo);
  } catch (error) {
    console.error("Error creating card info:", error);
    if (error.name === 'ValidationError') {
      console.error("Validation error details:", error.errors);
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get all cards for a user
exports.getUserCards = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

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
    const {
      cardNumber,
      cardLast4,
      cardholderName,
      customerName,
      expiryDate,
      cvv,
      saveCardDetails
    } = req.body;

    const updatedCard = await CardInfo.findByIdAndUpdate(
      cardId,
      {
        cardNumber,
        cardLast4: cardLast4 || cardNumber?.slice(-4),
        cardholderName,
        customerName: customerName || cardholderName,
        expiryDate,
        cvv,
        saveCardDetails
      },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
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
    console.error("Error deleting card:", error);
    res.status(500).json({ error: error.message });
  }
};
