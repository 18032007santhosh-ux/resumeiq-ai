const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
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
  score: {
    type: Number,
    default: null,
  },
  matchedSkills: {
    type: Array,
    default: [],
  },
  missingSkills: {
    type: Array,
    default: [],
  },
  strengths: {
    type: Array,
    default: [],
  },
  weaknesses: {
    type: Array,
    default: [],
  },
  recommendations: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
