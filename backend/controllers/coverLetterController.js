const CoverLetter = require('../models/CoverLetter');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const JobMatch = require('../models/JobMatch');
const AIService = require('../services/AIService');

// @desc    Generate a cover letter using AI
// @route   POST /api/cover-letter/generate
// @access  Private
const generateCoverLetter = async (req, res, next) => {
  try {
    const {
      resumeId,
      company,
      position,
      hiringManager,
      tone,
      length,
      jobDescription,
    } = req.body;

    // Validate inputs
    if (!resumeId || !company || !position || !tone || !length) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: resumeId, company, position, tone, length',
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

    if (!resume.parsedData || Object.keys(resume.parsedData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Selected resume has not been parsed successfully yet',
      });
    }

    // Load ATS Analysis (if available)
    const atsAnalysis = await ResumeAnalysis.findOne({ userId: req.user.id, resumeId }).sort({ createdAt: -1 });

    // Load Job Match results (if available)
    const jobMatch = await JobMatch.findOne({ userId: req.user.id, resumeId }).sort({ createdAt: -1 });

    // Call AIService to generate cover letter
    const generatedLetter = await AIService.generateCoverLetter({
      parsedResume: resume.parsedData,
      atsAnalysis,
      jobMatch,
      company,
      position,
      hiringManager,
      tone,
      length,
      jobDescription,
    });

    // Save cover letter to Database
    const coverLetter = await CoverLetter.create({
      userId: req.user.id,
      resumeId,
      company,
      position,
      hiringManager,
      tone,
      length,
      jobDescription,
      generatedLetter,
    });

    res.status(201).json({
      status: 'success',
      data: coverLetter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cover letters of user
// @route   GET /api/cover-letter/history
// @access  Private
const getCoverLetters = async (req, res, next) => {
  try {
    const coverLetters = await CoverLetter.find({ userId: req.user.id })
      .populate('resumeId', 'resumeTitle')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: coverLetters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cover letter by ID
// @route   GET /api/cover-letter/:id
// @access  Private
const getCoverLetterById = async (req, res, next) => {
  try {
    const coverLetter = await CoverLetter.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('resumeId', 'resumeTitle');

    if (!coverLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Cover letter not found or not authorized to access',
      });
    }

    res.status(200).json({
      status: 'success',
      data: coverLetter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update/Edit saved cover letter
// @route   PUT /api/cover-letter/:id
// @access  Private
const updateCoverLetter = async (req, res, next) => {
  try {
    const { generatedLetter } = req.body;

    if (!generatedLetter) {
      return res.status(400).json({
        status: 'error',
        message: 'generatedLetter content is required to update',
      });
    }

    const coverLetter = await CoverLetter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { generatedLetter },
      { new: true, runValidators: true }
    );

    if (!coverLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Cover letter not found or not authorized to access',
      });
    }

    res.status(200).json({
      status: 'success',
      data: coverLetter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cover letter
// @route   DELETE /api/cover-letter/:id
// @access  Private
const deleteCoverLetter = async (req, res, next) => {
  try {
    const coverLetter = await CoverLetter.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!coverLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Cover letter not found or not authorized to access',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cover letter deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCoverLetter,
  getCoverLetters,
  getCoverLetterById,
  updateCoverLetter,
  deleteCoverLetter,
};
