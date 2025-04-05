import mongoose from "mongoose";

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
    selectraiting: {
        type: String||null,
      
        trim: true
    },
   
   
  
  
}, { timestamps: true });

const Raiting = mongoose.model("Raitings", itemSchema);

export default Raiting;
