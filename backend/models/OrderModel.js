// models/OrderModel.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productName: { type: String, required: true },  // <- make sure you have productName too!
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true }, // ✅ MUST BE PRESENT
  status: { type: String, default: "Ordered" },
  paymentStatus: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
