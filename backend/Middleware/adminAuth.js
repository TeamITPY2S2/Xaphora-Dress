// middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

/**
 * Grants access to users with role 'admin' or 'order-management'.
 */
const adminAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const header = req.header('Authorization');
    if (!header) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    const token = header.replace('Bearer ', '');

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle payload key: 'id' vs 'userId'
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Only allow 'admin' or 'order-management' roles
    if (user.role !== 'admin' && user.role !== 'order-management') {
      return res.status(403).json({ message: 'Access denied. Admin or order-management privileges required.' });
    }

    // Attach user and proceed
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = adminAuth;
