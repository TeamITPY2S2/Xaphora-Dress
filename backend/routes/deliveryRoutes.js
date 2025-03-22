// routes/deliveryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createDeliveryAgent,
  getAllDeliveryAgents,
  updateDeliveryAgent,
  deleteDeliveryAgent,
  assignOrderToDeliveryAgent,
  assignAgentManually  // Newly added manual assignment function
} = require('../controllers/deliveryController');

// CRUD routes for delivery agents
router.post('/agents', createDeliveryAgent);       // Create a new delivery agent
router.get('/agents', getAllDeliveryAgents);         // Retrieve all delivery agents
router.put('/agents/:id', updateDeliveryAgent);      // Update a delivery agent by ID
router.delete('/agents/:id', deleteDeliveryAgent);   // Delete a delivery agent by ID

// Route to assign an order to a delivery agent automatically (based on shipping region)
router.post('/orders/:orderId/assign', assignOrderToDeliveryAgent);

// Route to manually assign an order to a delivery agent based on selected agent
router.put('/orders/:orderId/manual-assign', assignAgentManually);

module.exports = router;
