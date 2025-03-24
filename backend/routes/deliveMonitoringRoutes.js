// routes/deliveMonitoringRoutes.js
const express = require('express');
const router = express.Router();
const { getDeliveryProgressReport, getAgentPerformanceReport } = require('../controllers/deliveMonitoringController');

// Endpoint to get delivery progress report
router.get('/progress-report', getDeliveryProgressReport);

// Endpoint to get delivery agent performance report
router.get('/agent-performance', getAgentPerformanceReport);

module.exports = router;
