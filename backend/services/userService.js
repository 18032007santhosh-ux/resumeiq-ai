const User = require('../models/User');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const JobMatch = require('../models/JobMatch');
const InterviewSession = require('../models/InterviewSession');
const CoverLetter = require('../models/CoverLetter');
const GitHubAnalysis = require('../models/GitHubAnalysis');
const CareerChat = require('../models/CareerChat');
const Comparison = require('../models/Comparison');
const bcrypt = require('bcryptjs');

const findByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

const findById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({
    fullName: userData.fullName || userData.name,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    avatar: userData.avatar || ''
  });
};

const updateUserProfile = async (userId, name, email) => {
  return await User.findByIdAndUpdate(
    userId,
    { fullName: name, email: email.toLowerCase() },
    { new: true }
  ).select('-password');
};

const updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await User.findByIdAndUpdate(userId, { password: hashedPassword });
  return !!result;
};

const deleteUserAccount = async (userId) => {
  // Cascading deletes for all collections owned by the user
  await Promise.all([
    Resume.deleteMany({ userId }),
    ResumeAnalysis.deleteMany({ userId }),
    JobMatch.deleteMany({ userId }),
    InterviewSession.deleteMany({ userId }),
    CoverLetter.deleteMany({ userId }),
    GitHubAnalysis.deleteMany({ userId }),
    CareerChat.deleteMany({ userId }),
    Comparison.deleteMany({ userId }),
    User.findByIdAndDelete(userId)
  ]);
  return true;
};

// Store reset tokens temporarily
const resetTokens = new Map();

const saveResetToken = (email, token, expiresAt) => {
  resetTokens.set(token, { email, expiresAt });
};

const getResetToken = (token) => {
  return resetTokens.get(token);
};

const deleteResetToken = (token) => {
  resetTokens.delete(token);
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
  saveResetToken,
  getResetToken,
  deleteResetToken
};
