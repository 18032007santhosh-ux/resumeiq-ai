const ResumeAnalysis = require('../models/ResumeAnalysis');
const JobMatch = require('../models/JobMatch');
const InterviewSession = require('../models/InterviewSession');

/**
 * Get user's merged history timeline.
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
const getUserHistory = async (userId) => {
  const [atsAnalyses, jobMatches, interviewSessions] = await Promise.all([
    ResumeAnalysis.find({ userId }).populate('resumeId', 'resumeTitle'),
    JobMatch.find({ userId }).populate('resumeId', 'resumeTitle'),
    InterviewSession.find({ userId }).populate('resumeId', 'resumeTitle'),
  ]);

  // Format ATS Analyses
  const formattedAts = atsAnalyses.map(item => ({
    id: item._id,
    type: 'ats',
    resumeId: item.resumeId?._id || item.resumeId,
    resumeTitle: item.resumeId?.resumeTitle || 'Unknown Resume',
    score: item.overallScore,
    createdAt: item.createdAt,
  }));

  // Format Job Matches
  const formattedJobMatches = jobMatches.map(item => ({
    id: item._id,
    type: 'jobMatch',
    resumeId: item.resumeId?._id || item.resumeId,
    resumeTitle: item.resumeId?.resumeTitle || 'Unknown Resume',
    score: item.overallMatch,
    jobTitle: item.jobTitle || 'Job Match Analysis',
    createdAt: item.createdAt || item.updatedAt,
  }));

  // Format Interview Sessions
  const formattedInterviews = interviewSessions.map(item => ({
    id: item._id,
    type: 'interview',
    resumeId: item.resumeId?._id || item.resumeId,
    resumeTitle: item.resumeId?.resumeTitle || 'Unknown Resume',
    score: item.score,
    difficulty: item.difficulty,
    questionCount: item.questionCount,
    createdAt: item.createdAt || item.updatedAt,
  }));

  // Merge and sort by createdAt descending (newest first)
  const merged = [...formattedAts, ...formattedJobMatches, ...formattedInterviews];
  merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return merged;
};

/**
 * Get a specific history item by ID.
 * @param {string} id 
 * @param {string} userId 
 * @returns {Promise<Object|null>}
 */
const getUserHistoryItem = async (id, userId) => {
  // Check ResumeAnalysis
  let item = await ResumeAnalysis.findOne({ _id: id, userId }).populate('resumeId', 'resumeTitle');
  if (item) {
    return { type: 'ats', data: item };
  }

  // Check JobMatch
  item = await JobMatch.findOne({ _id: id, userId }).populate('resumeId', 'resumeTitle');
  if (item) {
    return { type: 'jobMatch', data: item };
  }

  // Check InterviewSession
  item = await InterviewSession.findOne({ _id: id, userId }).populate('resumeId', 'resumeTitle');
  if (item) {
    return { type: 'interview', data: item };
  }

  return null;
};

/**
 * Delete a specific history item by ID.
 * @param {string} id 
 * @param {string} userId 
 * @returns {Promise<Object|null>}
 */
const deleteUserHistoryItem = async (id, userId) => {
  // Check and delete ResumeAnalysis
  let deleted = await ResumeAnalysis.findOneAndDelete({ _id: id, userId });
  if (deleted) {
    return { type: 'ats', deleted };
  }

  // Check and delete JobMatch
  deleted = await JobMatch.findOneAndDelete({ _id: id, userId });
  if (deleted) {
    return { type: 'jobMatch', deleted };
  }

  // Check and delete InterviewSession
  deleted = await InterviewSession.findOneAndDelete({ _id: id, userId });
  if (deleted) {
    return { type: 'interview', deleted };
  }

  return null;
};

module.exports = {
  getUserHistory,
  getUserHistoryItem,
  deleteUserHistoryItem,
};
