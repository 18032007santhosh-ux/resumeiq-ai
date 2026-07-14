const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

// Protect all GitHub Analyzer routes
router.use(protect);

router.post('/analyze', githubController.analyzeGitHub);
router.get('/history', githubController.getHistory);
router.get('/:id', githubController.getAnalysis);
router.delete('/:id', githubController.deleteAnalysis);

module.exports = router;
