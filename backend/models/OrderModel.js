// models/OrderModel.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  shippingAddress: { 
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productName: { type: String, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['credit_card', 'debit_card', 'cash_on_delivery']
  },
  status: { 
    type: String, 
    default: "pending",
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  },
  paymentStatus: { type: String, default: "pending" },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Check if the model already exists before creating it
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
