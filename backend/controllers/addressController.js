const Address = require("../models/addressModel");

// CREATE a new address
exports.createAddress = async (req, res) => {
  try {
    const {
      userId,
      contactName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      isDefault
    } = req.body;

    // If the new address is set as default, unset default from other addresses for this user
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const newAddress = new Address({
      userId,
      contactName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      isDefault
    });

    await newAddress.save();
    return res.status(201).json(newAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    return res.status(500).json({ error: error.message });
  }
};

// READ all addresses for a specific user
exports.getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.find({ userId });
    return res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({ error: error.message });
  }
};

// READ a single address by its ID
exports.getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    return res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE an address by its ID
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      contactName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      isDefault
    } = req.body;

    // If isDefault is set, unset default from other addresses for this user
    if (isDefault) {
      // Find the address being updated to get the userId
      const existingAddress = await Address.findById(addressId);
      if (existingAddress) {
        await Address.updateMany(
          { userId: existingAddress.userId },
          { isDefault: false }
        );
      }
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        contactName,
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        isDefault
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    return res.status(200).json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ error: error.message });
  }
};

// DELETE an address by its ID
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }
    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ error: error.message });
  }
};
