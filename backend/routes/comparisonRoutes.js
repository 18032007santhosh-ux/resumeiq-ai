const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .post(comparisonController.compareResumes)
  .get(comparisonController.getComparisons);

router.route('/:id')
  .get(comparisonController.getComparisonById)
  .delete(comparisonController.deleteComparison);

module.exports = router;
