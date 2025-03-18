const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required: true,
        trim: true
    },
    lastName:{
        type:String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password:{
        type:String,
        required: true,
    }

},{timestamps: true }); 

m




