const express = require('express');
const router = express.Router();
const coverLetterController = require('../controllers/coverLetterController');
const { protect } = require('../middleware/authMiddleware');

// Protect all cover letter routes
router.use(protect);

router.post('/generate', coverLetterController.generateCoverLetter);
router.get('/history', coverLetterController.getCoverLetters);
router.get('/:id', coverLetterController.getCoverLetterById);
router.put('/:id', coverLetterController.updateCoverLetter);
router.delete('/:id', coverLetterController.deleteCoverLetter);

module.exports = router;
