// controllers/sellerController.js
const Seller = require('../models/Seller');
const asyncHandler = require('express-async-handler');

const signupSeller = asyncHandler(async (req, res) => {
  const { name, email, password, storeName, fcmToken } = req.body;

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
    fcmToken,
  });

  if (seller) {
    res.status(201).json({
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      storeName: seller.storeName,
      fcmToken: seller.fcmToken,
    });
  } else {
    res.status(400);
    throw new Error('Invalid seller data');
  }
});

module.exports = { signupSeller };
