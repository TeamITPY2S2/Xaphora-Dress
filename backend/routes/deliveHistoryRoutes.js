
const express = require('express');
const router = express.Router();
const { getUserDeliveryHistory, getAllDeliveryHistory } = require('../controllers/deliveHistoryController');

// get complete delivery history
router.get('/all', getAllDeliveryHistory);


router.get('/user/:customerId', getUserDeliveryHistory);

module.exports = router;
