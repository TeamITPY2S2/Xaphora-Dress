// routes/deliveryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createDeliveryAgent,
  getAllDeliveryAgents,
  getDeliveryAgentById,  // <-- New function
  updateDeliveryAgent,
  deleteDeliveryAgent,
  assignOrderToDeliveryAgent,
  assignAgentManually
} = require('../controllers/deliveryController');

// Create a new delivery agent
router.post('/agents', createDeliveryAgent);

// Retrieve all delivery agents
router.get('/agents', getAllDeliveryAgents);

// Retrieve a single delivery agent by ID
router.get('/agents/:id', getDeliveryAgentById);

// Update a delivery agent by ID
router.put('/agents/:id', updateDeliveryAgent);

// Delete a delivery agent by ID
router.delete('/agents/:id', deleteDeliveryAgent);

// Additional routes for orders (if needed)
router.post('/orders/:orderId/assign', assignOrderToDeliveryAgent);
router.put('/orders/:orderId/manual-assign', assignAgentManually);



module.exports = router;
