const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    petId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
   
    productid : {
        type: String,
        required: true,
        trim: true
    },
    customerid : {
        type: String,
        required: true,
        trim: true
    },
    reviewText  : {
        type: String,
        required: true,
        trim: true
    },
    reviewDate: {
        type: String||null,
      
        trim: true
    },  
    averageRating: {
        type: String||null,
      
        trim: true
    },
    commentReview: {
        type: String||null,
      
        trim: true
    },
  
   
  
  
}, { timestamps: true });

module.exports = mongoose.model("Raitings", itemSchema);


