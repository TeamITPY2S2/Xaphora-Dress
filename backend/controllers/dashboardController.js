const Admin = require("../models/adminModel");

const Order = require('../models/OrderModel');
const DeliveryAgent = require('../models/DeliveryAgent');
const Seller = require("../models/Seller");
const User = require("../models/UserModel"); // Includes buyers
const Address = require("../models/addressModel");


// ✅ Used by /api/dashboard for all roles
const getRoleBasedDashboardInfo = async (req, res) => {
  try {
    if (req.user && req.user.adminId) {
      const admin = await Admin.findById(req.user.adminId).select("-password");
      if (!admin) return res.status(404).json({ message: "Admin not found" });

      return res.json({
        userType: admin.adminType === "super-admin" ? "super-admin" : "admin",
        firstName: admin.firstName,
        lastName: admin.lastName,
      });
    }

    if (req.user && req.user.userId) {
      const user = await User.findById(req.user.userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      // Fetch recent orders and addresses for buyers
      let recentOrders = [];
      let addresses = [];
      if (user.role === 'buyer') {
        // Use correct field names: Order uses userId, Address uses userId
        recentOrders = await Order.find({ userId: req.user.userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();
        addresses = await Address.find({ userId: req.user.userId }).lean();
      }

      return res.json({
        userType: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        recentOrders,
        addresses,
      });
    }

    if (req.user && req.user.sellerId) {
      const seller = await Seller.findById(req.user.sellerId).select("-password");
      if (!seller) return res.status(404).json({ message: "Seller not found" });

      return res.json({
        userType: "seller",
        firstName: seller.firstName,
        lastName: seller.lastName,
      });
    }

    return res.status(400).json({ message: "Invalid token payload" });
  } catch (error) {
    console.error("Error fetching role-based dashboard info:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Used by /api/dashboard/superadmin/stats to get counts
const getDashboardData = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    const sellerCount = await Seller.countDocuments();
    const buyerCount = await User.countDocuments({ role: "buyer" });

    res.status(200).json({
      adminCount,
      sellerCount,
      buyerCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
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



module.exports = {
  getDashboardData,
  getRoleBasedDashboardInfo,
  getDeliveryDashboardData,
};

