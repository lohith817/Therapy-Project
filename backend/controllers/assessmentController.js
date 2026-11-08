const Assessment = require("../models/Assessment");

// @desc    Submit a mental health assessment
// @route   POST /api/assessments
// @access  Private (client)
const submitAssessment = async (req, res) => {
  try {
    const { stressLevel, anxietyLevel, depressionLevel, moodRating, notes } = req.body;

    const assessment = await Assessment.create({
      userId: req.user._id,
      stressLevel,
      anxietyLevel,
      depressionLevel,
      moodRating,
      notes,
    });

    res.status(201).json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's assessment history
// @route   GET /api/assessments/my
// @access  Private
const getMyAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: assessments.length, assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Therapist views a specific client's assessment history
// @route   GET /api/assessments/client/:clientId
// @access  Private (therapist)
const getClientAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.params.clientId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: assessments.length, assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitAssessment, getMyAssessments, getClientAssessments };
