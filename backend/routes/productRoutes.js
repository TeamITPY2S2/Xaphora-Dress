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
} = require("../controllers/productController");

// IMPORTANT: correct routes

// Create Product
router.post("/", upload.single("image"), createProduct);

// Get All Products
router.get("/", getProducts);

// Get Product by ID
router.get("/:id", getProductById);

// Update Product
router.put("/:id", upload.single("image"), updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

module.exports = router;