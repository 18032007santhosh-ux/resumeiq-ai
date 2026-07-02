const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');

// @desc    Create resume metadata
// @route   POST /api/resumes
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

// @desc    Upload resume file and create metadata
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a file',
      });
    }

    const { originalname, filename, size, mimetype, path: filePath } = req.file;

    const resume = await Resume.create({
      userId: req.user.id,
      resumeTitle: originalname, // Default title to original filename
      originalFileName: originalname,
      storedFileName: filename,
      fileSize: size,
      fileType: mimetype,
      storagePath: filePath,
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
// @route   GET /api/resumes
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
// @route   GET /api/resumes/:id
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
// @route   PUT /api/resumes/:id
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

// @desc    Delete resume metadata and file
// @route   DELETE /api/resumes/:id
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

    // Try to delete physical file
    if (resume.storagePath) {
      fs.unlink(resume.storagePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${resume.storagePath}`, err);
        }
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResume,
  uploadResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
};
