// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const User = require("../models/UserModel");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // First, check if the email exists in the Admin collection.
    let user = await Admin.findOne({ email });
    if (user) {
      // Compare the submitted password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // Generate a JWT containing admin details
      const token = jwt.sign(
        { adminId: user._id, adminType: user.adminType },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({ token, userType: "admin", user });
    }

    // If not found in Admin, check the User collection.
    user = await User.findOne({ email });
    if (user) {
      // Compare password (ensure that user passwords are hashed during creation)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // Generate a JWT containing user details
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({ token, userType: "user", user });
    }

    // If the email does not exist in either collection.
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };