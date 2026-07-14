const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

// Protect all career routes
router.use(protect);

router.post('/chat', careerController.sendMessage);
router.post('/new', careerController.createConversation);
router.get('/history', careerController.getConversations);
router.get('/history/:id', careerController.getConversationById);
router.put('/history/:id/rename', careerController.renameConversation);
router.delete('/history/:id', careerController.deleteConversation);

module.exports = router;
