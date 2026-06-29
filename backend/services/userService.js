const bcrypt = require('bcryptjs');

// In-memory user database placeholder
const users = [];

// Pre-fill a demo user
const initDemoUser = async () => {
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  users.push({
    id: 'demo-user-id',
    name: 'Santhosh Kumar',
    email: 'user@example.com',
    password: hashedPassword,
    createdAt: new Date()
  });
  console.log('👥 In-memory demo user created: user@example.com / Password123!');
};

initDemoUser();

const findByEmail = async (email) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const findById = async (id) => {
  return users.find(user => user.id === id);
};

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    createdAt: new Date()
  };
  users.push(newUser);
  return newUser;
};

const updateUserPassword = async (userId, newPassword) => {
  const user = await findById(userId);
  if (!user) return false;
  user.password = await bcrypt.hash(newPassword, 10);
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
  updateUserPassword,
  saveResetToken,
  getResetToken,
  deleteResetToken
};
