const User = require('../models/User');
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

const updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await User.findByIdAndUpdate(userId, { password: hashedPassword });
  return !!result;
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
  updateUserPassword,
  saveResetToken,
  getResetToken,
  deleteResetToken
};
