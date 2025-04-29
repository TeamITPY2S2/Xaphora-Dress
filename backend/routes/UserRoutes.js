// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
require("dotenv").config();

// Import User Controller
const UserController = require("../controllers/UserControllers");
const User = require("../models/UserModel");

// Define Routes
router.get("/", UserController.getAllUsers);         // Get all users
router.post("/", UserController.createUser);         // Create a new user
router.get("/:id", UserController.getUserById);      // Get a user by ID
router.put("/:id", UserController.updateUser);       // Update a user by ID
router.delete("/:id", UserController.deleteUser);    // Delete a user by ID

router.post("/update-points", async (req, res) => {
  try {
    const { userId, pointsUsed, pointsEarned } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Deduct used points and add earned points
    user.loyaltyPoints = user.loyaltyPoints - pointsUsed + pointsEarned;
    await user.save();

    res.json({ 
      message: "Loyalty points updated successfully",
      currentPoints: user.loyaltyPoints
    });
  } catch (error) {
    console.error("Error updating loyalty points:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;