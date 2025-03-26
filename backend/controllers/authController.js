// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const User = require("../models/UserModel");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check the email exists
    let user = await Admin.findOne({ email });
    if (user) {

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // generate a JWT token
      const token = jwt.sign(
        { adminId: user._id, adminType: user.adminType },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({ token, userType: "admin", user });
    }

    // If not in Admin, check the User collection
    user = await User.findOne({ email });
    if (user) {

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({ token, userType: "user", user });
    }

    // If the email does not exist show error msg
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };