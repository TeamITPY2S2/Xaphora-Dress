// controllers/deliveMonitoringController.js
const Order = require('../models/Order');
const DeliveryAgent = require('../models/DeliveryAgent');

// Generates a report that groups orders by their status (e.g., Ordered, Packed, Shipped, Delivered)
exports.getDeliveryProgressReport = async (req, res) => {
  try {
    const report = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      message: "Delivery progress report generated successfully",
      report
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generates a report for each delivery agent with total and delivered orders
exports.getAgentPerformanceReport = async (req, res) => {
  try {
    // Use the aggregation framework on the DeliveryAgent collection
    // to lookup orders and calculate performance metrics.
    const detailedReport = await DeliveryAgent.aggregate([
      {
        $lookup: {
          from: "orders", // Ensure this matches the collection name for orders in MongoDB
          localField: "_id",
          foreignField: "deliveryAgent",
          as: "orders"
        }
      },
      {
        $project: {
          name: 1,
          assignedRegion: 1,
          totalOrders: { $size: "$orders" },
          deliveredOrders: {
            $size: {
              $filter: {
                input: "$orders",
                as: "order",
                cond: { $eq: ["$$order.status", "Delivered"] }
              }
            }
          }
        }
      }
    ]);

    res.status(200).json({
      message: "Agent performance report generated successfully",
      report: detailedReport
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
