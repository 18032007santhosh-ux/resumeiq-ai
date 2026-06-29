const Resume = require('../models/Resume');

// @desc    Create resume metadata
// @route   POST /api/resume
// @access  Private
const createResume = async (req, res, next) => {
  try {
    const { resumeTitle, originalFileName, fileType } = req.body;

    if (!resumeTitle || !originalFileName) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide resumeTitle and originalFileName',
      });
    }

    const resume = await Resume.create({
      userId: req.user.id,
      resumeTitle,
      originalFileName,
      fileType: fileType || '',
    });

    res.status(201).json({
      status: 'success',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List authenticated user's resumes
// @route   GET /api/resume
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ uploadDate: -1 });

    res.status(200).json({
      status: 'success',
      results: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Return one resume
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });

    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found or not authorized to access',
      });
    }

    res.status(200).json({
      status: 'success',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume metadata
// @route   PUT /api/resume/:id
// @access  Private
const updateResume = async (req, res, next) => {
  try {
    const { resumeTitle, originalFileName, fileType } = req.body;

    let resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });

    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found or not authorized to modify',
      });
    }

    const updates = {};
    if (resumeTitle !== undefined) updates.resumeTitle = resumeTitle;
    if (originalFileName !== undefined) updates.originalFileName = originalFileName;
    if (fileType !== undefined) updates.fileType = fileType;

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume metadata
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });

    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found or not authorized to delete',
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Resume metadata deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
};
