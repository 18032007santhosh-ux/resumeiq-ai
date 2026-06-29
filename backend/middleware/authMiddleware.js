const { verifyToken } = require('../utils/jwtHelper');
const userService = require('../services/userService');

const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token missing'
    });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, invalid token'
      });
    }

    const user = await userService.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    // Attach user (excluding password) to request
    req.user = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      createdAt: user.createdAt
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, authentication failed'
    });
  }
};

module.exports = { protect };
