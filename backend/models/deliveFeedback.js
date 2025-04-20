
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({

  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  
  deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent', required: true },
 
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
