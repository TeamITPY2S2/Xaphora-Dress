
const express = require('express');
const router = express.Router();
const {
  createDeliveryAgent,
  getAllDeliveryAgents,
  getDeliveryAgentById,  
  updateDeliveryAgent,
  deleteDeliveryAgent,
  assignOrderToDeliveryAgent,
  assignAgentManually
} = require('../controllers/deliveryController');

router.post('/agents', createDeliveryAgent);

router.get('/agents', getAllDeliveryAgents);

router.get('/agents/:id', getDeliveryAgentById);

router.put('/agents/:id', updateDeliveryAgent);

router.delete('/agents/:id', deleteDeliveryAgent); 

router.post('/orders/:orderId/assign', assignOrderToDeliveryAgent);
router.put('/orders/:orderId/manual-assign', assignAgentManually);



module.exports = router;
