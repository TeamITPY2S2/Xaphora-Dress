const express = require('express');
const router = express.Router();
const {
  createDeliveryAgent,
  getAllDeliveryAgents,
  updateDeliveryAgent,
  deleteDeliveryAgent,
} = require('../controllers/deliveryController');

// CRUD routes
router.post('/agents', createDeliveryAgent); // Create
router.get('/agents', getAllDeliveryAgents); // Read
router.put('/agents/:id', updateDeliveryAgent); // Update
router.delete('/agents/:id', deleteDeliveryAgent); // Delete

module.exports = router;
