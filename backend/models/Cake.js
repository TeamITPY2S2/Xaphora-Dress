import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // "500g", "1kg", "1.5kg"
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const cakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    type: {
      type: String,
      enum: ["cake", "cupcake"],
      default: "cake",
    },

    category: {
      type: String,
      enum: ["birthday", "wedding", "bride-to-be", "custom", "cupcakes", "other"],
      default: "other",
    },

    description: { type: String, default: "" },
    images: [{ type: String }], // URLs

    // options
    sizes: { type: [sizeSchema], default: [] },
    flavours: {
      type: [String],
      default: ["chocolate", "vanilla", "marble"],
    },

    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Cake", cakeSchema);