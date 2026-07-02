const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes are protected
router.use(protect);

router.route('/upload')
  .post(upload.single('file'), resumeController.uploadResume);

router.route('/')
  .post(resumeController.createResume)
  .get(resumeController.getResumes);

router.route('/:id')
  .get(resumeController.getResumeById)
  .put(resumeController.updateResume)
  .delete(resumeController.deleteResume);

module.exports = router;
