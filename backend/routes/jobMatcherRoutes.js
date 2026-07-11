const express = require('express');
const router = express.Router();
const jobMatcherController = require('../controllers/jobMatcherController');
const { protect } = require('../middleware/authMiddleware');

// All routes require auth protect middleware
router.use(protect);

router.post('/match', jobMatcherController.matchJobDescription);

module.exports = router;
