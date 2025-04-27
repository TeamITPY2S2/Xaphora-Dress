// backend/routes/addressRoutes.js
const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.post("/", addressController.createAddress);
router.get("/user/:userId", addressController.getAddressesByUser);
router.get("/:id", addressController.getAddressById);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
