const mongoose = require("mongoose");

const deliveryAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  region: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("DeliveryAgent", deliveryAgentSchema);
