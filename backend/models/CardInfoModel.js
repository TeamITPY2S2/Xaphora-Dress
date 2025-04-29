const mongoose = require("mongoose");

const cardInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: false
  },
  cardNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{16}$/.test(v);
      },
      message: props => `${props.value} is not a valid card number!`
    }
  },
  cardLast4: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid last 4 digits!`
    }
  },
  cardholderName: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(v);
      },
      message: props => `${props.value} is not a valid expiry date!`
    }
  },
  cvv: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{3,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid CVV!`
    }
  },
  saveCardDetails: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CardInfoModel", cardInfoSchema);
