// controllers/adminController.js
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Create a Super Admin
 * Forces adminType to "super-admin" and returns a token in the response.
 */
const createSuperAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new super admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      adminType: "super-admin",
    });

    await newAdmin.save();

    // Sign a token for the newly created super admin
    const token = jwt.sign(
      { adminId: newAdmin._id, adminType: "super-admin" },
      process.env.JWT_SECRET || "yoursecretkey",
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Super Admin created successfully",
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        adminType: newAdmin.adminType,
      },
      token: token, // Include the token
    });
  } catch (err) {
    console.error("Error creating super admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new Admin (for any adminType except "super-admin")
 * Only a logged-in super admin should access this route.
 */
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, adminType } = req.body;

    // Prevent creating a super admin here
    if (adminType === "super-admin") {
      return res.status(400).json({
        message: "Cannot create a super admin through this route",
      });
    }

    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      adminType,
    });

    await newAdmin.save();

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        adminType: newAdmin.adminType,
      },
    });
  } catch (err) {
    console.error("Error creating admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get All Admins
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }
    return res.json({ admins });
  } catch (err) {
    console.error("Error fetching admins:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get Admin by ID
 */
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.json({ admin });
  } catch (err) {
    console.error("Error fetching admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update Admin
 * Hash the password again if you are updating it.
 */
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, adminType } = req.body;

    let updateFields = { firstName, lastName, email, adminType };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.json({
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error("Error updating admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete Admin
 */
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSuperAdmin,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};