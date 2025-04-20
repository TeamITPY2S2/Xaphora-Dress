
const express = require('express');
const router = express.Router();
const {
  getDeliveryProgressReport,
  getAgentPerformanceReport
} = require('../controllers/deliveMonitoringController');


router.get('/progress-report', getDeliveryProgressReport);

router.get('/agent-performance', getAgentPerformanceReport);

module.exports = router;
