// controllers/deliveMonitoringController.js

const mongoose = require('mongoose');
const Order = require("../models/OrderModel");
const DeliveryAgent = require('../models/DeliveryAgent');

// 1) Delivery Progress Report
exports.getDeliveryProgressReport = async (req, res) => {
  try {
    const report = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          orderIds: { $push: "$_id" },
          customerNames: { $push: "$customerName" }
        }
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          orderIds: 1,
          customerNames: 1,
          _id: 0
        }
      }
    ]);
    return res.status(200).json({
      message: "Delivery progress report generated successfully",
      report
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 2) Agent Performance Report
exports.getAgentPerformanceReport = async (req, res) => {
  try {
    // ← READ from req.params, since our route is /agent-performance/:agentId
    const { agentId } = req.params;
    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }

    const detailed = await DeliveryAgent.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(agentId) } },
      {
        $lookup: {
          from: "orders",
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
                as: "o",
                cond: { $eq: ["$$o.status", "Delivered"] }
              }
            }
          },
          orderDetails: {
            $map: {
              input: "$orders",
              as: "o",
              in: {
                orderId: "$$o._id",
                customerName: "$$o.customerName"
              }
            }
          }
        }
      }
    ]);

    if (!detailed.length) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    return res.status(200).json({
      message: "Agent performance report generated successfully",
      report: detailed[0]
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
