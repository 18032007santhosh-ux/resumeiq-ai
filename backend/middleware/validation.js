const { body, validationResult } = require('express-validator');

// Generic validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      })),
      message: 'Validation failed'
    });
  }
  next();
};

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

const profileValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  validate
];

const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  validate
];

const jobMatchValidation = [
  body('resumeId')
    .trim()
    .notEmpty()
    .withMessage('Resume ID is required')
    .isMongoId()
    .withMessage('Invalid Resume ID format'),
  body('jobDescription')
    .trim()
    .notEmpty()
    .withMessage('Job description is required'),
  validate
];

const interviewValidation = [
  body('resumeId')
    .trim()
    .notEmpty()
    .withMessage('Resume ID is required')
    .isMongoId()
    .withMessage('Invalid Resume ID format'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  profileValidation,
  passwordChangeValidation,
  jobMatchValidation,
  interviewValidation
};
