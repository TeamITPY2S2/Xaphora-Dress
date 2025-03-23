// routes/deliveHistoryRoutes.js
const express = require('express');
const router = express.Router();
const { getUserDeliveryHistory, getAllDeliveryHistory } = require('../controllers/deliveHistoryController');

// Route for admin: get complete delivery history
router.get('/all', getAllDeliveryHistory);

// Route for customers: get delivery history for a specific customer ID
router.get('/user/:customerId', getUserDeliveryHistory);

module.exports = router;
