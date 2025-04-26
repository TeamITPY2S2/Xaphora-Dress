// controllers/deliveryController.js
const DeliveryAgent = require('../models/DeliveryAgent');
const Order = require('../models/Order'); // Using our temporary Order model

// Create a new delivery agent
exports.createDeliveryAgent = async (req, res) => {
  try {
    // Updated to include email
    const { name, contact, email, assignedRegion } = req.body;
    const newAgent = new DeliveryAgent({ name, contact, email, assignedRegion });
    await newAgent.save();
    res.status(201).json({ message: 'Delivery agent created successfully', agent: newAgent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all delivery agents
exports.getAllDeliveryAgents = async (req, res) => {
  try {
    const agents = await DeliveryAgent.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NEW: Retrieve a single delivery agent by ID
exports.getDeliveryAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await DeliveryAgent.findById(id);
    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a delivery agent
exports.updateDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    // Updated to include email
    const { name, contact, email, assignedRegion } = req.body;
    const updatedAgent = await DeliveryAgent.findByIdAndUpdate(
      id,
      { name, contact, email, assignedRegion },
      { new: true }
    );
    if (!updatedAgent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }
    res.status(200).json({ message: 'Delivery agent updated successfully', agent: updatedAgent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a delivery agent
exports.deleteDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAgent = await DeliveryAgent.findByIdAndDelete(id);
    if (!deletedAgent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }
    res.status(200).json({ message: 'Delivery agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Automatically Assign an Order to a Delivery Agent Based on the Order's Shipping Region
exports.assignOrderToDeliveryAgent = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Retrieve the order details from our temporary Order model
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find a delivery agent whose assignedRegion matches the order's shippingRegion
    const agent = await DeliveryAgent.findOne({ assignedRegion: order.shippingRegion });
    if (!agent) {
      return res.status(404).json({ message: "No available delivery agent for this region" });
    }

    // Assign the delivery agent to the order
    order.deliveryAgent = agent._id;
    await order.save();

    res.status(200).json({
      message: "Order assigned to delivery agent successfully",
      order,
      agent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Manually Assign an Order to a Delivery Agent (via dropdown selection)
exports.assignAgentManually = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { agentId } = req.body;

    // Retrieve the order details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate if the selected agent exists
    const agent = await DeliveryAgent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Delivery agent not found" });
    }

    // Assign the selected agent to the order
    order.deliveryAgent = agentId;
    await order.save();

    res.status(200).json({
      message: "Agent manually assigned successfully",
      order,
      agent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
