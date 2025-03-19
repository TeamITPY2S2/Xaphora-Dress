const express = require("express");
const router = express.Router();

// Import User Controller
const UserController = require("../Controllers/UserControllers");

// Define Routes
router.get("/", UserController.getAllUsers);  // Route to get all users
router.post("/", UserController.createUser);  //Route to post users

// Export the router to use in the server.js
module.exports = router;