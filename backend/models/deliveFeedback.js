// models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  // Reference to the related order
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  // Reference to the delivery agent responsible for the order
  deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent', required: true },
  // Customer rating (e.g., 1 to 5 stars)
  rating: { type: Number, required: true, min: 1, max: 5 },
  // Optional comments about the delivery experience
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
