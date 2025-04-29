// backend/models/AddressModel.js

const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Address", AddressSchema);
