// routes/deliveFeedbackRoutes.js
const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback
} = require('../controllers/deliveFeedbackController');

// Route to submit feedback
router.post('/', submitFeedback);

// Route to get all feedback (for admin view)
router.get('/', getAllFeedback);

// Route to update a specific feedback by its ID
router.put('/:id', updateFeedback);

// Route to delete a specific feedback by its ID
router.delete('/:id', deleteFeedback);

module.exports = router;
