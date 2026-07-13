const Resume = require('../models/Resume');
const JobMatch = require('../models/JobMatch');
const { calculateScore } = require('../utils/scoreCalculator');
const AIService = require('../services/AIService');

// @desc    Match resume against a job description
// @route   POST /api/job/match
// @access  Private
const matchJobDescription = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both resumeId and jobDescription',
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

    // Calculate matches
    const scores = calculateScore(resume, jobDescription);

    // Get recommendations from Gemini API
    let recommendations = [];
    try {
      recommendations = await AIService.generateJobMatchSuggestions(resume.parsedData, jobDescription);
    } catch (aiError) {
      console.error('Gemini API failed, using fallback recommendations:', aiError.message);
      recommendations = [
        'Add more keywords from the job description directly to your resume skills section.',
        'Detail your experience with matching projects highlighting relevant tools.',
        'Refine education and experience highlights to match job description keywords.'
      ];
    }

    // Extract job title from jobDescription: first line or fallback
    let jobTitle = 'Job Match Analysis';
    if (jobDescription) {
      const firstLine = jobDescription.trim().split('\n')[0].trim();
      if (firstLine && firstLine.length < 80) {
        jobTitle = firstLine;
      } else if (firstLine) {
        jobTitle = firstLine.substring(0, 80) + '...';
      }
    }

    // Save to Database
    const jobMatch = await JobMatch.create({
      userId: req.user.id,
      resumeId,
      overallMatch: scores.overallMatch,
      keywordMatch: scores.keywordMatch,
      skillsMatch: scores.skillsMatch,
      experienceMatch: scores.experienceMatch,
      educationMatch: scores.educationMatch,
      matchedKeywords: scores.matchedKeywords,
      missingKeywords: scores.missingKeywords,
      recommendations,
      jobTitle,
      jobDescription,
    });

    res.status(200).json({
      status: 'success',
      data: jobMatch,
    });
  } catch (error) {
    next(error);
  }
};

const getJobMatches = async (req, res, next) => {
  try {
    const matches = await JobMatch.find({ userId: req.user.id })
      .populate('resumeId', 'resumeTitle')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchJobDescription,
  getJobMatches,
};

