// server/routes/fcmRoutes.js
const express = require('express');
const { saveFcmToken } = require('../controllers/fcmController');
const router = express.Router();

router.post('/save-fcm-token', saveFcmToken);

module.exports = router;
