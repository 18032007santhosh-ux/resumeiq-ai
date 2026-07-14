const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const JobMatch = require('../models/JobMatch');
const InterviewSession = require('../models/InterviewSession');
const CoverLetter = require('../models/CoverLetter');
const GitHubAnalysis = require('../models/GitHubAnalysis');

// @desc    Get dashboard metrics and statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch counts and latest score in parallel
    const [
      totalResumes,
      latestAnalysis,
      totalJobMatches,
      totalInterviews,
      totalCoverLetters,
      totalGitHubAnalyses
    ] = await Promise.all([
      Resume.countDocuments({ userId }),
      ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 }),
      JobMatch.countDocuments({ userId }),
      InterviewSession.countDocuments({ userId }),
      CoverLetter.countDocuments({ userId }),
      GitHubAnalysis.countDocuments({ userId })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalResumes,
        latestAtsScore: latestAnalysis ? latestAnalysis.overallScore : null,
        totalJobMatches,
        totalInterviews,
        totalCoverLetters,
        totalGitHubAnalyses
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
