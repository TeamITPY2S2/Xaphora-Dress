// controllers/sellerController.js
const asyncHandler = require('express-async-handler');
const Seller = require('../models/Seller');

// @desc    Create a new seller (Signup)
// @route   POST /api/sellers
const createSeller = asyncHandler(async (req, res) => {
  const { name, email, password, storeName,role, fcmToken } = req.body;

  // Check if seller exists
  const sellerExists = await Seller.findOne({ email });
  if (sellerExists) {
    res.status(400);
    throw new Error('Seller already exists');
  }

  // Create new seller
  const seller = await Seller.create({
    name,
    email,
    password,
    storeName,
    role,
    fcmToken,
  });

  if (seller) {
    res.status(201).json(seller);
  } else {
    res.status(400);
    throw new Error('Invalid seller data');
  }
});

// @desc    Get all sellers
// @route   GET /api/sellers
const getSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find({});
  res.json(sellers);
});

// @desc    Get a seller by ID
// @route   GET /api/sellers/:id
const getSellerById = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (seller) {
    res.json(seller);
  } else {
    res.status(404);
    throw new Error('Seller not found');
  }
});

// @desc    Update a seller
// @route   PUT /api/sellers/:id
const updateSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (seller) {
    seller.name = req.body.name || seller.name;
    seller.email = req.body.email || seller.email;
    if (req.body.password) {
      seller.password = req.body.password; // Will be hashed in pre-save hook
    }
    seller.storeName = req.body.storeName || seller.storeName;
    seller.fcmToken = req.body.fcmToken || seller.fcmToken;

    const updatedSeller = await seller.save();
    res.json(updatedSeller);
  } else {
    res.status(404);
    throw new Error('Seller not found');
  }
});

// @desc    Delete a seller
// @route   DELETE /api/sellers/:id
const deleteSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (seller) {
    await seller.deleteOne();
    res.json({ message: 'Seller removed' });
  } else {
    res.status(404);
    throw new Error('Seller not found');
  }
});

module.exports = {
  createSeller,
  getSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
};
