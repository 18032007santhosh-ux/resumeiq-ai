const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(historyController.getHistory);

router.route('/:id')
  .delete(historyController.deleteHistory);

module.exports = router;
