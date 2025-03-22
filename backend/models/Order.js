// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  items: [{ type: String }], // Simplified items list
  shippingRegion: { type: String, required: true },
  deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent' },
  status: { type: String, default: 'Ordered' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
