const mongoose = require('mongoose');

const GitHubAnalysisSchema = new mongoose.Schema({
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
  githubUrl: {
    type: String,
    required: true,
    trim: true,
  },
  githubUsername: {
    type: String,
    required: true,
    trim: true,
  },
  profile: {
    type: Object,
    required: true,
  },
  repositories: {
    type: Array,
    default: [],
  },
  languages: {
    type: Object,
    default: {},
  },
  statistics: {
    type: Object,
    default: {},
  },
  analysis: {
    type: Object,
    required: true,
  },
  overallScore: {
    type: Number,
    required: true,
  },
  strengths: {
    type: [String],
    default: [],
  },
  weaknesses: {
    type: [String],
    default: [],
  },
  recommendations: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// Index for query optimization
GitHubAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('GitHubAnalysis', GitHubAnalysisSchema);
