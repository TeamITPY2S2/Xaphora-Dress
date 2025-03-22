// models/DeliveryAgent.js
const mongoose = require('mongoose');

const DeliveryAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  assignedRegion: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DeliveryAgent', DeliveryAgentSchema);
