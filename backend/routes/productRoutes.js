// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

// Use memory storage so that files are available in req.file without saving locally.
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

// Create Product: expects a file input with field name "image"
router.post("/products", upload.single("image"), createProduct);

// Get All Products
router.get("/products", getProducts);

// Get Product by ID
router.get("/products/:id", getProductById);

// Update Product: supports a new file upload (if provided) and text fields via FormData
router.put("/products/:id", upload.single("image"), updateProduct);

// Delete Product
router.delete("/products/:id", deleteProduct);

module.exports = router;
