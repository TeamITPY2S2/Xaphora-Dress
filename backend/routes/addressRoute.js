const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Create a new address
router.post("/", addressController.createAddress);

// Get all addresses for a specific user
router.get("/user/:userId", addressController.getUserAddresses);

// Get a single address by its ID
router.get("/:addressId", addressController.getAddressById);

// Update an address by its ID
router.put("/:addressId", addressController.updateAddress);

// Delete an address by its ID
router.delete("/:addressId", addressController.deleteAddress);

module.exports = router;
