const Product = require("../models/productModel");
const { sendNotification } = require("../services/notificationService");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, category, price, stockQuantity, imageUrl, description } = req.body;

    // Check if required fields are provided
    if (!name || !category || !price || !stockQuantity || !imageUrl || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      stockQuantity,
      imageUrl,
      description,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", newProduct });
  } catch (error) {
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
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock and trigger alert if necessary
    if (product.stockQuantity <= product.minimumStockLevel) {
      sendNotification(product);
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
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
  deleteProduct
};
