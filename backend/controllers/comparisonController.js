const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Comparison = require('../models/Comparison');
const AIService = require('../services/AIService');
const atsEngine = require('../services/atsEngine/scoreAggregator');
const { extractKeywords } = require('../utils/keywordExtractor');

// Helper to diff arrays (case-insensitive)
const diffArrays = (arr1 = [], arr2 = []) => {
  const set1 = new Set(arr1.map(s => s.trim().toLowerCase()));
  const set2 = new Set(arr2.map(s => s.trim().toLowerCase()));

  // Map to original casing
  const origMap1 = {};
  arr1.forEach(s => { origMap1[s.trim().toLowerCase()] = s; });
  const origMap2 = {};
  arr2.forEach(s => { origMap2[s.trim().toLowerCase()] = s; });

  const added = [];
  const removed = [];
  const common = [];

  set2.forEach(item => {
    if (set1.has(item)) {
      common.push(origMap2[item] || origMap1[item]);
    } else {
      added.push(origMap2[item]);
    }
  });

  set1.forEach(item => {
    if (!set2.has(item)) {
      removed.push(origMap1[item]);
    }
  });

  return { added, removed, common };
};

// @desc    Compare two resumes
// @route   POST /api/compare
// @access  Private
const compareResumes = async (req, res, next) => {
  try {
    const { resumeId1, resumeId2 } = req.body;

    if (!resumeId1 || !resumeId2) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both resumeId1 and resumeId2',
      });
    }

    // Fetch resumes
    const [resume1, resume2] = await Promise.all([
      Resume.findOne({ _id: resumeId1, userId: req.user.id }),
      Resume.findOne({ _id: resumeId2, userId: req.user.id })
    ]);

    if (!resume1 || !resume2) {
      return res.status(404).json({
        status: 'error',
        message: 'One or both resumes not found or unauthorized',
      });
    }

    // Ensure both are parsed
    if (!resume1.parsedData || !resume2.parsedData) {
      return res.status(400).json({
        status: 'error',
        message: 'Both resumes must be parsed successfully before comparing',
      });
    }

    // Get analyses or calculate scores
    let [analysis1, analysis2] = await Promise.all([
      ResumeAnalysis.findOne({ resumeId: resumeId1, userId: req.user.id }),
      ResumeAnalysis.findOne({ resumeId: resumeId2, userId: req.user.id })
    ]);

    let score1 = analysis1 ? analysis1.overallScore : (resume1.atsScore !== null && resume1.atsScore !== undefined ? resume1.atsScore : null);
    let score2 = analysis2 ? analysis2.overallScore : (resume2.atsScore !== null && resume2.atsScore !== undefined ? resume2.atsScore : null);
    let breakdown1 = analysis1 ? analysis1.breakdown : null;
    let breakdown2 = analysis2 ? analysis2.breakdown : null;

    if (!breakdown1 || score1 === null || score1 === undefined) {
      const result = atsEngine.analyze(resume1.parsedData);
      score1 = result.score;
      breakdown1 = result.breakdown;
    }
    if (!breakdown2 || score2 === null || score2 === undefined) {
      const result = atsEngine.analyze(resume2.parsedData);
      score2 = result.score;
      breakdown2 = result.breakdown;
    }

    // Calculate Diffs
    const skillsDiff = diffArrays(resume1.parsedData.skills || [], resume2.parsedData.skills || []);

    const keywords1 = extractKeywords(resume1.rawText);
    const keywords2 = extractKeywords(resume2.rawText);
    const keywordsDiff = diffArrays(keywords1, keywords2);

    const sectionDiffs = {
      summary: {
        v1Length: (resume1.parsedData.summary || '').length,
        v2Length: (resume2.parsedData.summary || '').length,
        changed: (resume1.parsedData.summary || '').trim() !== (resume2.parsedData.summary || '').trim()
      },
      education: {
        v1Count: (resume1.parsedData.education || []).length,
        v2Count: (resume2.parsedData.education || []).length,
      },
      experience: {
        v1Count: (resume1.parsedData.experience || []).length,
        v2Count: (resume2.parsedData.experience || []).length,
      },
      projects: {
        v1Count: (resume1.parsedData.projects || []).length,
        v2Count: (resume2.parsedData.projects || []).length,
      },
      certifications: {
        v1Count: (resume1.parsedData.certifications || []).length,
        v2Count: (resume2.parsedData.certifications || []).length,
      }
    };

    const diffData = {
      scoreDifference: score2 - score1,
      breakdownDifference: {
        contact: (breakdown2?.contact || 0) - (breakdown1?.contact || 0),
        education: (breakdown2?.education || 0) - (breakdown1?.education || 0),
        experience: (breakdown2?.experience || 0) - (breakdown1?.experience || 0),
        skills: (breakdown2?.skills || 0) - (breakdown1?.skills || 0),
        projects: (breakdown2?.projects || 0) - (breakdown1?.projects || 0),
        certifications: (breakdown2?.certifications || 0) - (breakdown1?.certifications || 0),
      },
      skills: {
        addedCount: skillsDiff.added.length,
        removedCount: skillsDiff.removed.length,
        commonCount: skillsDiff.common.length
      },
      keywords: {
        addedCount: keywordsDiff.added.length,
        removedCount: keywordsDiff.removed.length,
        commonCount: keywordsDiff.common.length
      },
      sections: sectionDiffs
    };

    // Generate Gemini AI Summary
    const aiSummary = await AIService.generateResumeComparison(resume1, resume2, diffData);

    const comparisonData = {
      skills: skillsDiff,
      keywords: keywordsDiff,
      sections: sectionDiffs,
      diffSummary: diffData,
      aiSummary
    };

    // Save Comparison
    const comparison = await Comparison.create({
      userId: req.user.id,
      resumeId1,
      resumeId2,
      score1,
      score2,
      comparisonData
    });

    res.status(201).json({
      status: 'success',
      data: comparison
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comparisons for user
// @route   GET /api/compare
// @access  Private
const getComparisons = async (req, res, next) => {
  try {
    const comparisons = await Comparison.find({ userId: req.user.id })
      .populate('resumeId1', 'resumeTitle uploadDate')
      .populate('resumeId2', 'resumeTitle uploadDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: comparisons.length,
      data: comparisons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comparison by ID
// @route   GET /api/compare/:id
// @access  Private
const getComparisonById = async (req, res, next) => {
  try {
    const comparison = await Comparison.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('resumeId1', 'resumeTitle uploadDate atsScore parsedData')
      .populate('resumeId2', 'resumeTitle uploadDate atsScore parsedData');

    if (!comparison) {
      return res.status(404).json({
        status: 'error',
        message: 'Comparison record not found or unauthorized',
      });
    }

    res.status(200).json({
      status: 'success',
      data: comparison
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comparison
// @route   DELETE /api/compare/:id
// @access  Private
const deleteComparison = async (req, res, next) => {
  try {
    const comparison = await Comparison.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!comparison) {
      return res.status(404).json({
        status: 'error',
        message: 'Comparison record not found or unauthorized',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Comparison deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  compareResumes,
  getComparisons,
  getComparisonById,
  deleteComparison
};
