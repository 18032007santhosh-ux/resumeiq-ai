const mongoose = require('mongoose');

const JobMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  overallMatch: {
    type: Number,
    required: true,
  },
  keywordMatch: {
    type: Number,
    required: true,
  },
  skillsMatch: {
    type: Number,
    required: true,
  },
  experienceMatch: {
    type: Number,
    required: true,
  },
  educationMatch: {
    type: Number,
    required: true,
  },
  matchedKeywords: {
    type: [String],
    default: [],
  },
  missingKeywords: {
    type: [String],
    default: [],
  },
  recommendations: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('JobMatch', JobMatchSchema);
