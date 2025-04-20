
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

  status: {
    type: String,
    enum: ["Ordered", "Packed", "Shipped", "Delivered"],
    default: "Ordered"
  },

  placedDate: {
    type: Date,
    default: Date.now
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Order', OrderSchema);
