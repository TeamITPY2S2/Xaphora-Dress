// backend/controllers/addressController.js
const Address = require("../models/AddressModel");

exports.createAddress = async (req, res) => {
  try {
    const address = new Address(req.body);
    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save address" });
  }
};

exports.getAddressesByUser = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch address" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update address" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Address deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete address" });
  }
};
