const express = require("express");
const router = express.Router();

// Import User Controller
const UserController = require("../Controllers/UserControllers");

// Define Routes
router.get("/", UserController.getAllUsers);  // Route to get all users
router.post("/", UserController.createUser);  //Route to post users
router.get("/:id", UserController.getUserById); //Route to get by ID
router.put("/:id", UserController.updateUser); //Route to update user

// Export the router to use in the server.js
module.exports = router;