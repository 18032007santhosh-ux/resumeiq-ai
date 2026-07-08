const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const AIService = require('../services/AIService');

// @desc    Get AI suggestions for a resume
// @route   POST /api/analysis/suggestions
// @access  Private
const getSuggestions = async (req, res, next) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a resumeId',
      });
    }

    // Verify resume ownership
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found or not authorized to access',
      });
    }

    // Find existing analysis
    let analysis = await ResumeAnalysis.findOne({ resumeId, userId: req.user.id });
    if (!analysis) {
      return res.status(404).json({
        status: 'error',
        message: 'ATS analysis not found. Please analyze the resume first.',
      });
    }

    // Check if suggestions already exist (cached)
    if (analysis.suggestions) {
      return res.status(200).json({
        status: 'success',
        data: analysis.suggestions,
      });
    }

    // Generate using Gemini API
    try {
      const suggestions = await AIService.generateSuggestions(
        resume.parsedData,
        analysis.overallScore,
        analysis.breakdown,
        analysis.strengths,
        analysis.improvements,
        analysis.issues || []
      );

      // Save into MongoDB
      analysis.suggestions = suggestions;
      analysis.suggestionsGeneratedAt = new Date();
      await analysis.save();

      return res.status(200).json({
        status: 'success',
        data: suggestions,
      });
    } catch (aiError) {
      console.error('AI Suggestion Service Error:', aiError);
      return res.status(500).json({
        success: false,
        message: 'Unable to generate AI suggestions.',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuggestions,
};
