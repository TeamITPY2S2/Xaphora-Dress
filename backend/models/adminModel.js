// backend/models/adminModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    adminType: {
      type: String,
      default: "regular",
      enum: [
        "super-admin",
        "delivery",
        "inventory",
        "order-management",
        "reviews",
        "user-management",
        "regular"
      ],
    },
  },
  { timestamps: true } // This ensures createdAt and updatedAt fields
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);