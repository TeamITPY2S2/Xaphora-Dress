const Info = require("../models/infoModel");

// CREATE a new card info
exports.createCardInfo = async (req, res) => {
  try {
    const {
      userId,
      cardNumber,
      cardholderName,
      expiryDate,
      cvv,
      saveCardDetails
    } = req.body;

    // Create a new card info document
    const newCardInfo = new Info({
      userId,
      cardNumber,
      cardholderName,
      expiryDate,
      cvv,
      saveCardDetails
    });

    await newCardInfo.save();
    return res.status(201).json(newCardInfo);
  } catch (error) {
    console.error("Error creating card info:", error);
    return res.status(500).json({ error: error.message });
  }
};

// READ all cards for a specific user
exports.getUserCards = async (req, res) => {
  try {
    const { userId } = req.params;
    const cards = await Info.find({ userId });
    return res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching user cards:", error);
    return res.status(500).json({ error: error.message });
  }
};

// READ a single card by ID
exports.getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Info.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card info not found" });
    }
    return res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card info:", error);
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE card info
exports.updateCardInfo = async (req, res) => {
  try {
    const { cardId } = req.params;
    const {
      cardNumber,
      cardholderName,
      expiryDate,
      cvv,
      saveCardDetails
    } = req.body;

    const updatedCard = await Info.findByIdAndUpdate(
      cardId,
      {
        cardNumber,
        cardholderName,
        expiryDate,
        cvv,
        saveCardDetails
      },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: "Card info not found" });
    }

    return res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error updating card info:", error);
    return res.status(500).json({ error: error.message });
  }
};

// DELETE card info
exports.deleteCardInfo = async (req, res) => {
  try {
    const { cardId } = req.params;
    const deletedCard = await Info.findByIdAndDelete(cardId);
    if (!deletedCard) {
      return res.status(404).json({ error: "Card info not found" });
    }
    return res.status(200).json({ message: "Card info deleted successfully" });
  } catch (error) {
    console.error("Error deleting card info:", error);
    return res.status(500).json({ error: error.message });
  }
};
