const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwtMiddleware");
// Optionally, use role-based access control:
// const allowRoles = require("../middleware/roleMiddleware");

const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/addAdminController");

// Protect these routes with JWT middleware
router.post("/create", verifyToken, createAdmin);
router.get("/", verifyToken, getAllAdmins);
router.get("/:id", verifyToken, getAdminById);
router.put("/:id", verifyToken, updateAdmin);
router.delete("/:id", verifyToken, deleteAdmin);

module.exports = router;