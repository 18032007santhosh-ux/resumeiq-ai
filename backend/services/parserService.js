const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { cleanText } = require('../utils/textCleaner');
const { extractStructuredData } = require('../utils/resumeExtractor');

/**
 * Parses a resume file (PDF or DOCX) and extracts structured data.
 * @param {string} filePath - Path to the uploaded resume file
 * @param {string} fileType - MIME type of the file
 * @returns {Promise<Object>} - The extracted raw text and structured data
 */
const parseResumeFile = async (filePath, fileType) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    let rawText = '';
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf' || fileType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      rawText = pdfData.text;
    } else if (
      ext === '.docx' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      rawText = result.value;
    } else {
      throw new Error(`Unsupported file type: ${ext || fileType}`);
    }

    // Clean the extracted text
    const cleanedText = cleanText(rawText);

    // Extract structured data
    const parsedData = extractStructuredData(cleanedText);

    return { rawText: cleanedText, parsedData };
  } catch (error) {
    console.error('Error in parseResumeFile:', error);
    throw error;
  }
};

module.exports = {
  parseResumeFile
};
