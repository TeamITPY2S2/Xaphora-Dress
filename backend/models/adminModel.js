// backend/models/adminModel.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  adminType: {
    type: String,
    enum: ["super-admin", "delivery", "inventory", "order-management", "reviews", "user-management"],
    required: true,
  },
}, { timestamps: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);