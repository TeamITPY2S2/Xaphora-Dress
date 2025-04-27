const mongoose = require("mongoose");

const cardInfoSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  cardLast4: {
    type: String,  // ⭐ Save only LAST 4 digits of card number
    required: true
  },
  expiryDate: {
    type: String,  // e.g. "06/26"
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CardInfoModel", cardInfoSchema);
