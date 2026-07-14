const mongoose = require('mongoose');

const ComparisonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeId1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  resumeId2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  score1: {
    type: Number,
    required: true,
  },
  score2: {
    type: Number,
    required: true,
  },
  comparisonData: {
    type: Object,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Comparison', ComparisonSchema);
