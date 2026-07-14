const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const historyRoutes = require('./routes/history');
const parserRoutes = require('./routes/parserRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const jobMatcherRoutes = require('./routes/jobMatcherRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const careerRoutes = require('./routes/careerRoutes');
const coverLetterRoutes = require('./routes/coverLetterRoutes');
const githubRoutes = require('./routes/github');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Secure Express headers with Helmet
app.use(helmet());

// Rate limiting configurations
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter to all API routes
app.use('/api/', limiter);

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://resumeiq-ai-opal.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    if (allowedOrigins.includes(normalizedOrigin) || normalizedOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/resume', parserRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/job', jobMatcherRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/compare', comparisonRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/dashboard', dashboardRoutes);



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ResumeIQ AI API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Main error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
