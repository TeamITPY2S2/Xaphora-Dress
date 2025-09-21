// backend/controllers/productController.js
const Product = require("../models/productModel");
const cloudinary = require("../configarations/cloudinary");
const streamifier = require("streamifier");
const { sendNotification } = require("../services/notificationService");

// Lightweight product suggestion endpoint (name prefix / partial, case-insensitive)
// Returns: [{ _id, name, imageUrl }] limited by ?limit= param (default 8)
const suggestProducts = async (req, res) => {
  try {
    const { q = "", limit = 8 } = req.query;
    const trimmed = q.toString().trim();
    if (!trimmed) return res.status(200).json([]);

    // Simple regex prefix/contains search (escape special chars)
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    const products = await Product.find({ name: regex })
      .select("name imageUrl")
      .limit(Math.min(Number(limit) || 8, 15));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching suggestions", error });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, category, price, stockQuantity, description } = req.body;

    // Validate required text fields
    if (!name || !category || !price || !stockQuantity || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imageUrl = "";
    if (req.file) {
      // Upload the file buffer to Cloudinary using a stream
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({ message: "Image file is required" });
    }

    const newProduct = new Product({
      name,
      category,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      imageUrl,
      description,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: "Error creating product", error });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// Update product (edit)
const updateProduct = async (req, res) => {
  try {
    // Prepare updateData from text fields (coming via FormData)
    let updateData = { ...req.body };

    // Convert numeric fields explicitly (if provided)
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.stockQuantity) {
      updateData.stockQuantity = Number(updateData.stockQuantity);
    }

    // If a new image file is provided, upload it to Cloudinary and add the secure URL
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      updateData.imageUrl = result.secure_url;
    }

    // Update the product document
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Optionally trigger notifications if stock is low (if applicable)
    // if (product.stockQuantity <= (product.minimumStockLevel || 0)) {
    //   sendNotification(product);
    // }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ message: "Error updating product", error });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  suggestProducts,
};
