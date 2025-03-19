const DeliveryAgent = require('../models/DeliveryAgent');

// Create a new delivery agent
exports.createDeliveryAgent = async (req, res) => {
  try {
    const { name, contact, assignedRegion } = req.body;
    const newAgent = new DeliveryAgent({ name, contact, assignedRegion });
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

// Update a delivery agent
exports.updateDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, assignedRegion } = req.body;
    const updatedAgent = await DeliveryAgent.findByIdAndUpdate(
      id,
      { name, contact, assignedRegion },
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
