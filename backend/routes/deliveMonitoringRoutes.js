const express = require('express');
const router  = express.Router();

// Import exactly the two exported functions
const {
  getDeliveryProgressReport,
  getAgentPerformanceReport
} = require('../controllers/deliveMonitoringController');

// Mount them under your chosen paths:
router.get('/progress-report',       getDeliveryProgressReport);
router.get('/agent-performance/:agentId', getAgentPerformanceReport);

module.exports = router;
