// server/controllers/fcmController.js
// Make sure to import your User model (or Seller/User model) appropriately.
const User = require('../models/Seller');  // adjust path and model name as required

const saveFcmToken = async (req, res) => {
  const { token, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.fcmToken = token;
    await user.save();
    res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { saveFcmToken };
