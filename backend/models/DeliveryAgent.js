
const mongoose = require('mongoose');

const DeliveryAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
 
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
