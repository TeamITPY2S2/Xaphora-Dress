// controllers/deliveMonitoringController.js
const Order = require('../models/Order');
const DeliveryAgent = require('../models/DeliveryAgent');

// Generates a report that groups orders by their status (e.g., Ordered, Packed, Shipped, Delivered)
// and includes an array of order IDs and customer IDs for each group.
exports.getDeliveryProgressReport = async (req, res) => {
  try {
    const report = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          orderIds: { $push: "$_id" },
          customerIds: { $push: "$customer_id" } // Assuming your Order model uses "customer_id"
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

// Generates a report for each delivery agent with total and delivered orders,
// and includes detailed order information (order ID and customer ID).
exports.getAgentPerformanceReport = async (req, res) => {
  try {
    const detailedReport = await DeliveryAgent.aggregate([
      {
        $lookup: {
          from: "orders", // Ensure this matches your orders collection name in MongoDB
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
          },
          orderDetails: {
            $map: {
              input: "$orders",
              as: "order",
              in: {
                orderId: "$$order._id",
                customerId: "$$order.customer_id" // Adjust if your field is named differently (e.g., "customer")
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
