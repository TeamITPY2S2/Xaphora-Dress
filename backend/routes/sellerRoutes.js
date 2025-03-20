// routes/sellerRoutes.js
const express = require('express');
const router = express.Router();
const {
  createSeller,
  getSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
} = require('../controllers/sellerController');

router.route('/')
  .post(createSeller)    // Create seller (Signup)
  .get(getSellers);      // Get all sellers

router.route('/:id')
  .get(getSellerById)     // Get seller by ID
  .put(updateSeller)      // Update seller
  .delete(deleteSeller);  // Delete seller

module.exports = router;
