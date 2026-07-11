const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/generate', interviewController.generateInterview);
router.post('/submit', interviewController.submitInterview);
router.get('/history', interviewController.getHistory);
router.get('/:id', interviewController.getInterviewById);
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;
