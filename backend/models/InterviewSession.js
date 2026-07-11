const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
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
  jobMatchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobMatch',
    default: null,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  questionCount: {
    type: Number,
    required: true,
  },
  questions: [{
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    question: { type: String, required: true },
    sampleAnswer: { type: String, default: '' },
    keyPoints: [{ type: String }],
    tips: { type: String, default: '' },
    commonMistakes: { type: String, default: '' }
  }],
  userAnswers: [{
    questionIndex: { type: Number, required: true },
    answer: { type: String, default: '' }
  }],
  feedback: [{
    questionIndex: { type: Number },
    score: { type: Number },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: { type: String }
  }],
  score: {
    type: Number,
    default: null,
  },
  overallFeedback: {
    score: { type: Number },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendedTopics: [{ type: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
