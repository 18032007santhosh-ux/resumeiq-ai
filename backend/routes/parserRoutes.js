const express = require('express');
const router = express.Router();
const { parseResume } = require('../controllers/parserController');
const { protect } = require('../middleware/authMiddleware');

router.post('/parse/:resumeId', protect, parseResume);

module.exports = router;
