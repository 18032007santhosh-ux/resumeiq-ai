const Analysis = require('../models/Analysis');

// @desc    Get user's analysis history
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const history = await Analysis.find({ userId: req.user.id })
      .populate('resumeId', 'resumeTitle originalFileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete analysis history record
// @route   DELETE /api/history/:id
// @access  Private
const deleteHistory = async (req, res, next) => {
  try {
    const record = await Analysis.findOne({ _id: req.params.id, userId: req.user.id });

    if (!record) {
      return res.status(404).json({
        status: 'error',
        message: 'History record not found or not authorized to delete',
      });
    }

    await Analysis.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'History record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
  deleteHistory,
};
