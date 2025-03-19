const User = require("../models/UserModel");

// Function to get all users
const getAllUsers = async (req, res, next) => {
  try {
    // Find all users in the database
    const users = await User.find(); 

    // If no users found, return an empty array
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    // Respond with the list of users
    res.json({ users });
  } catch (err) {
    console.error(err);
    // Handle server errors
    res.status(500).json({ message: "Error retrieving users" });
  }
};


// Function to create a new user
const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the new user's data
    res.status(201).json({newUser});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
};


// Function to get a specific user by ID
const getUserById = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      // Find a user by ID
      const user = await User.findById(id);
  
      // If user not found
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Respond with the user data
      res.json({user});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving user" });
    }
  };

// Function to update user details
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    // Find the user by ID and update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password },
      { new: true }
    );

    // If user not found
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.json({updatedUser});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    // If user not found
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the deleted user's data
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Export controller functions
module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};