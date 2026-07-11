const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');
const JobMatch = require('../models/JobMatch');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const AIService = require('../services/AIService');

// @desc    Generate personalized interview questions
// @route   POST /api/interview/generate
// @access  Private
const generateInterview = async (req, res, next) => {
  try {
    const { resumeId, jobMatchId, difficulty, questionCount } = req.body;

    if (!resumeId || !difficulty || !questionCount) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide resumeId, difficulty, and questionCount',
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

    // Fetch analysis and job match if they exist
    const atsAnalysis = await ResumeAnalysis.findOne({ resumeId, userId: req.user.id });
    let jobMatch = null;
    if (jobMatchId) {
      jobMatch = await JobMatch.findOne({ _id: jobMatchId, userId: req.user.id });
    }

    // Call AI Service
    const questions = await AIService.generateInterviewQuestions({
      parsedResume: resume.parsedData || {},
      atsAnalysis: atsAnalysis ? { score: atsAnalysis.overallScore, breakdown: atsAnalysis.breakdown } : null,
      jobDescription: resume.matchedJob?.jobDescription || null, // fallback or match details
      jobMatchScore: jobMatch ? jobMatch.overallMatch : null,
      difficulty,
      questionCount,
    });

    const session = await InterviewSession.create({
      userId: req.user.id,
      resumeId,
      jobMatchId: jobMatchId || null,
      difficulty,
      questionCount,
      questions,
      userAnswers: [],
      feedback: [],
      score: null,
      overallFeedback: null,
    });

    res.status(201).json({
      status: 'success',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit user answers for evaluation
// @route   POST /api/interview/submit
// @access  Private
const submitInterview = async (req, res, next) => {
  try {
    const { sessionId, userAnswers } = req.body;

    if (!sessionId || !userAnswers || !Array.isArray(userAnswers)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide sessionId and userAnswers array',
      });
    }

    const session = await InterviewSession.findOne({ _id: sessionId, userId: req.user.id });
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Interview session not found or unauthorized',
      });
    }

    // Call evaluation service
    const evaluation = await AIService.evaluateInterviewAnswers(session.questions, userAnswers);

    session.userAnswers = userAnswers;
    session.feedback = evaluation.feedback;
    session.score = evaluation.score;
    session.overallFeedback = evaluation.overallFeedback;

    await session.save();

    res.status(200).json({
      status: 'success',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's interview history
// @route   GET /api/interview/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const history = await InterviewSession.find({ userId: req.user.id })
      .populate('resumeId', 'resumeTitle originalFileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific interview session
// @route   GET /api/interview/:id
// @access  Private
const getInterviewById = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('resumeId', 'resumeTitle originalFileName');

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Interview session not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a specific interview session
// @route   DELETE /api/interview/:id
// @access  Private
const deleteInterview = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Interview session not found or unauthorized to delete',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Interview session deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateInterview,
  submitInterview,
  getHistory,
  getInterviewById,
  deleteInterview,
};
