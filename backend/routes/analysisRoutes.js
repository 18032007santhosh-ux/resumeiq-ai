const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

// All analysis routes are protected
router.use(protect);

router.route('/suggestions')
  .post(analysisController.getSuggestions);

module.exports = router;
