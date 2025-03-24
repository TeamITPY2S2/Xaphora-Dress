// routes/UserRoutes.js
const express = require("express");
const router = express.Router();
require("dotenv").config();

// Import User Controller
const UserController = require("../controllers/UserControllers");

// Define Routes
router.get("/", UserController.getAllUsers);         // Get all users
router.post("/", UserController.createUser);         // Create a new user
router.get("/:id", UserController.getUserById);      // Get a user by ID
router.put("/:id", UserController.updateUser);       // Update a user by ID
router.delete("/:id", UserController.deleteUser);    // Delete a user by ID

module.exports = router;