const mongoose = require('mongoose');

const CoverLetterSchema = new mongoose.Schema({
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
  company: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  hiringManager: {
    type: String,
    trim: true,
  },
  tone: {
    type: String,
    required: true,
    enum: ['Professional', 'Formal', 'Friendly', 'Confident', 'Enthusiastic'],
  },
  length: {
    type: String,
    required: true,
    enum: ['Short', 'Medium', 'Long'],
  },
  jobDescription: {
    type: String,
    trim: true,
  },
  generatedLetter: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Index for quick queries of user's cover letter history sorted by newest first
CoverLetterSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CoverLetter', CoverLetterSchema);
