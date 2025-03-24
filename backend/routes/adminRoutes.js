// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/jwtMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createSuperAdmin,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");

/**
 * Create Super Admin:
 * For first-time setup, you can use the unprotected route.
 * Once a super admin exists, comment out the unprotected version and use the protected one.
 */
// UNPROTECTED (for initial creation):
router.post("/create-super-admin", createSuperAdmin);
// PROTECTED (after super admin exists):
// router.post("/create-super-admin", verifyToken, allowRoles("super-admin"), createSuperAdmin);

/**
 * Create a Regular Admin:
 * Only accessible by a logged-in super admin.
 */
router.post("/create", verifyToken, allowRoles("super-admin"), createAdmin);

/**
 * Get All Admins:
 * Only accessible by a super admin.
 */
router.get("/", verifyToken, allowRoles("super-admin"), getAllAdmins);

/**
 * Get Admin by ID:
 * Only accessible by a super admin.
 */
router.get("/:id", verifyToken, allowRoles("super-admin"), getAdminById);

/**
 * Update Admin:
 * Only accessible by a super admin.
 */
router.put("/:id", verifyToken, allowRoles("super-admin"), updateAdmin);

/**
 * Delete Admin:
 * Only accessible by a super admin.
 */
router.delete("/:id", verifyToken, allowRoles("super-admin"), deleteAdmin);

module.exports = router;