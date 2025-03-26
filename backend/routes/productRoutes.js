const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require("../controllers/productController");

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
