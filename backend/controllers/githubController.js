const GitHubAnalysis = require('../models/GitHubAnalysis');
const GitHubService = require('../services/GitHubService');

/**
 * Perform a new GitHub portfolio analysis and save to DB
 */
const analyzeGitHub = async (req, res) => {
  const { resumeId, githubUrl } = req.body;

  if (!resumeId || !githubUrl) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide both resumeId and githubUrl'
    });
  }

  try {
    const analysisData = await GitHubService.analyzeGitHub(req.user.id, resumeId, githubUrl);
    
    const githubUsername = GitHubService.extractUsername(githubUrl);

    const newAnalysis = new GitHubAnalysis({
      userId: req.user.id,
      resumeId,
      githubUrl,
      githubUsername,
      ...analysisData
    });

    await newAnalysis.save();

    res.status(201).json({
      status: 'success',
      data: newAnalysis
    });
  } catch (error) {
    console.error('Error in analyzeGitHub controller:', error);
    res.status(error.message.includes('rate limit') ? 429 : 400).json({
      status: 'error',
      message: error.message || 'An error occurred during GitHub portfolio analysis'
    });
  }
};

/**
 * Retrieve analysis history for current user
 */
const getHistory = async (req, res) => {
  try {
    const history = await GitHubAnalysis.find({ userId: req.user.id })
      .select('githubUsername githubUrl overallScore createdAt resumeId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: history
    });
  } catch (error) {
    console.error('Error in getHistory controller:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve analysis history'
    });
  }
};

/**
 * Retrieve a specific GitHub analysis report by ID
 */
const getAnalysis = async (req, res) => {
  try {
    const analysis = await GitHubAnalysis.findOne({ _id: req.params.id, userId: req.user.id });

    if (!analysis) {
      return res.status(404).json({
        status: 'error',
        message: 'GitHub analysis report not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: analysis
    });
  } catch (error) {
    console.error('Error in getAnalysis controller:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve analysis details'
    });
  }
};

/**
 * Delete a specific GitHub analysis report
 */
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await GitHubAnalysis.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!analysis) {
      return res.status(404).json({
        status: 'error',
        message: 'GitHub analysis report not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'GitHub analysis report deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteAnalysis controller:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete analysis report'
    });
  }
};

module.exports = {
  analyzeGitHub,
  getHistory,
  getAnalysis,
  deleteAnalysis
};
