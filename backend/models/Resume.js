const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeTitle: {
    type: String,
    required: [true, 'Please add a resume title'],
    trim: true,
  },
  originalFileName: {
    type: String,
    required: [true, 'Please add the original file name'],
  },
  fileType: {
    type: String,
    default: '',
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  atsScore: {
    type: Number,
    default: null,
  },
  parsedData: {
    type: Object,
    default: {},
  },
  aiSuggestions: {
    type: Array,
    default: [],
  },
  matchedJob: {
    type: Object,
    default: null,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
