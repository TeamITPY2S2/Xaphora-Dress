const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cardholderName: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String, // e.g. "MM/YY"
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  saveCardDetails: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Info", infoSchema);
