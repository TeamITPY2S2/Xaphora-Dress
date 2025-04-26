// models/DeliveryAgent.js
const mongoose = require('mongoose');

const DeliveryAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Validates that contact is exactly 10 digits and contains only numbers
  contact: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit number!`
    }
  },
  
  // Validates the email format, ensures uniqueness and stores in lowercase
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  
  assignedRegion: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DeliveryAgent', DeliveryAgentSchema);
