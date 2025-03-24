const User = require("../models/UserModel");

// Function to get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Function to create a new user
const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // NOTE: In production, ensure you hash the password before saving
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    await newUser.save();
    res.status(201).json({ newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Function to get a specific user by ID
const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
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
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};