
const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback
} = require('../controllers/deliveFeedbackController');


router.post('/', submitFeedback);

router.get('/', getAllFeedback);

router.put('/:id', updateFeedback);

router.delete('/:id', deleteFeedback);

module.exports = router;
