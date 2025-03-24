// middleware/roleMiddleware.js
const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // For admin routes, we expect req.user to have adminType (set during login for admins)
    if (!req.user || !allowedRoles.includes(req.user.adminType)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

module.exports = allowRoles;