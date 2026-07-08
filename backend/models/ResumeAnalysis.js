const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema({
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
  overallScore: {
    type: Number,
    required: true,
  },
  breakdown: {
    contact: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
  },
  strengths: {
    type: [String],
    default: [],
  },
  improvements: {
    type: [String],
    default: [],
  },
  issues: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
