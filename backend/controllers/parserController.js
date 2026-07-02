const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const { parseResumeFile } = require('../services/parserService');

// @desc    Parse an uploaded resume
// @route   POST /api/resume/parse/:resumeId
// @access  Private
const parseResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Ensure the file exists
    if (!fs.existsSync(resume.storagePath)) {
      resume.parsingStatus = 'Parsing Failed';
      await resume.save();
      return res.status(404).json({ message: 'Resume file not found on disk' });
    }

    // Update status to Parsing
    resume.parsingStatus = 'Parsing';
    await resume.save();

    // Parse the file
    try {
      const { rawText, parsedData } = await parseResumeFile(resume.storagePath, resume.fileType);
      
      // Update resume with parsed data
      resume.rawText = rawText;
      resume.parsedData = parsedData;
      resume.parsingStatus = 'Parsed Successfully';
      await resume.save();
      
      res.status(200).json(resume);
    } catch (parseError) {
      resume.parsingStatus = 'Parsing Failed';
      await resume.save();
      console.error('Parsing failed:', parseError);
      res.status(500).json({ message: 'Failed to parse resume file', error: parseError.message });
    }
  } catch (error) {
    console.error('Error in parseResume controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  parseResume
};
