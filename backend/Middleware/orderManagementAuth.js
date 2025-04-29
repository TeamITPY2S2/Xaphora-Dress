const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const orderManagementAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user is an admin or order-management user
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (admin.adminType !== 'admin' && admin.adminType !== 'order-management' && admin.adminType !== 'super-admin') {
      return res.status(403).json({ message: 'Access denied. Admin or order-management privileges required.' });
    }

    req.user = admin;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = orderManagementAuth; 