
const express = require('express');
const { signupSeller } = require('../controllers/sellerController');
const router = express.Router();

router.post('/signup', signupSeller);

module.exports = router;
