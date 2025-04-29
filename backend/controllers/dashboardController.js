// controllers/dashboardController.js
const Admin = require("../models/adminModel");
const User = require("../models/UserModel");
const Order = require('../models/Order');
const DeliveryAgent = require('../models/DeliveryAgent');

const getDashboardData = async (req, res) => {
  try {
    // If it's an admin
    if (req.user.adminId) {
      const admin = await Admin.findById(req.user.adminId).select("-password");
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      // Return something
      return res.json({
        userType: admin.adminType === "super-admin" ? "super-admin" : "admin",
        firstName: admin.firstName,
        lastName: admin.lastName,
        // etc.
      });
    }

    // If it's a user
    if (req.user.userId) {
      const user = await User.findById(req.user.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({
        userType: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        // etc.
      });
    }

    return res.status(400).json({ message: "Invalid token payload" });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get delivery dashboard data
const getDeliveryDashboardData = async (req, res) => {
    try {
        // Get total orders
        const totalOrders = await Order.countDocuments();
        
        // Get delivered orders
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
        
        // Get recent orders (last 10)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id customerName status totalAmount createdAt');
            
        // Get agent performance
        const agents = await DeliveryAgent.find();
        const agentPerformance = await Promise.all(
            agents.map(async (agent) => {
                const deliveredCount = await Order.countDocuments({
                    deliveryAgent: agent._id,
                    status: 'Delivered'
                });
                
                // Calculate on-time delivery percentage
                const totalDelivered = await Order.countDocuments({
                    deliveryAgent: agent._id,
                    status: 'Delivered'
                });
                
                const onTimeDelivery = totalDelivered ? 
                    Math.round((deliveredCount / totalDelivered) * 100) : 0;
                
                return {
                    _id: agent._id,
                    name: agent.firstName + ' ' + agent.lastName,
                    ordersDelivered: deliveredCount,
                    onTimeDelivery,
                    rating: agent.rating || 0
                };
            })
        );

        res.json({
            totalOrders,
            deliveredOrders,
            recentOrders,
            agentPerformance
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};

module.exports = { getDashboardData, getDeliveryDashboardData };