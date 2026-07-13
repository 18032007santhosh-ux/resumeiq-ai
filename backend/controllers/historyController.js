const historyService = require('../services/historyService');

// @desc    Get user's analysis history timeline
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const history = await historyService.getUserHistory(req.user.id);

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single history item detail report
// @route   GET /api/history/:id
// @access  Private
const getHistoryItem = async (req, res, next) => {
  try {
    const result = await historyService.getUserHistoryItem(req.params.id, req.user.id);

    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'History record not found or not authorized',
      });
    }

    res.status(200).json({
      status: 'success',
      type: result.type,
      data: result.data,
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
    const result = await historyService.deleteUserHistoryItem(req.params.id, req.user.id);

    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'History record not found or not authorized to delete',
      });
    }

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
  getHistoryItem,
  deleteHistory,
};
