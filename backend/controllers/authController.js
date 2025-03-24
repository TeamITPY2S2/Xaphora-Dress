// backend/controllers/authController.js

const User = require("../models/UserModel");
// If using hashed passwords, also import bcrypt and compare with bcrypt.compare.

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 2. Compare password (plain text check here)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Return success
    // (Optionally generate a JWT token if you want)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };