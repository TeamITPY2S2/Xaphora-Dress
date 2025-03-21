const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ["Ordered", "Packed", "Shipped", "Delivered"],
    default: "Ordered",
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAgent", // Reference to the DeliveryAgent model
  },
});

module.exports = mongoose.model("Order", orderSchema);
