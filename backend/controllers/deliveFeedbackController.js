// controllers/deliveFeedbackController.js
const Feedback = require('../models/deliveFeedback');

// Submit new feedback (already implemented)
exports.submitFeedback = async (req, res) => {
  try {
    const { order, deliveryAgent, rating, comment } = req.body;
    const feedback = new Feedback({ order, deliveryAgent, rating, comment });
    await feedback.save();
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all feedback (already implemented)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('order deliveryAgent');
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { rating, comment } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { rating, comment },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      message: 'Feedback updated successfully',
      feedback: updatedFeedback
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;

    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
