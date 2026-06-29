const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userService = require('../services/userService');
const { generateToken } = require('../utils/jwtHelper');

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email and password'
      });
    }

    const userExists = await userService.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    const user = await userService.createUser({ name, email, password });
    const token = generateToken({ id: user.id });

    // Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(214 || 201).json({
      status: 'success',
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const token = generateToken({ id: user.id });

    // Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Request reset link
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email'
      });
    }

    const user = await userService.findByEmail(email);
    if (!user) {
      // For security, don't reveal user doesn't exist
      return res.status(200).json({
        status: 'success',
        message: 'If the email exists, a reset link was sent'
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    userService.saveResetToken(user.email, resetToken, expiresAt);

    // Mock send reset email (log to console)
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    console.log(`=========================================`);
    console.log(`✉️ PASSWORD RESET REQUEST FOR: ${email}`);
    console.log(`🔗 Link: ${resetUrl}`);
    console.log(`=========================================`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent successfully (Check server logs in dev mode)'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password - Set new password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide token and new password'
      });
    }

    const tokenData = userService.getResetToken(token);
    if (!tokenData) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired password reset token'
      });
    }

    if (Date.now() > tokenData.expiresAt) {
      userService.deleteResetToken(token);
      return res.status(400).json({
        status: 'error',
        message: 'Password reset token has expired'
      });
    }

    const user = await userService.findByEmail(tokenData.email);
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    await userService.updateUserPassword(user.id, password);
    userService.deleteResetToken(token);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now login.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  logout
};
