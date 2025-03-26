// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  customerName: {
    type: String,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  // Renamed from orderStatus to status with your required steps
  status: {
    type: String,
    enum: ["Ordered", "Packed", "Shipped", "Delivered"],
    default: "Ordered"
  },
  // Optionally track the date the order was placed
  placedDate: {
    type: Date,
    default: Date.now
  },
  // Keep track of when this record was created
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Order', OrderSchema);
