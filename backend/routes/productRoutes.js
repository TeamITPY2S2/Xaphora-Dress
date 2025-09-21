const express = require("express");
const router = express.Router();
const multer = require("multer");

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import controller functions
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  suggestProducts,
} = require("../controllers/productController");

// IMPORTANT: correct routes

// Create Product
router.post("/", upload.single("image"), createProduct);

// Get All Products
router.get("/", getProducts);

// Suggest products (must be before /:id)
router.get("/suggest", suggestProducts);

// Get Product by ID
router.get("/:id", getProductById);

// Update Product
router.put("/:id", upload.single("image"), updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

module.exports = router;