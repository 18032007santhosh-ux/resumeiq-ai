/**
 * Cleans and normalizes extracted text from resumes.
 * @param {string} text - The raw text extracted from PDF or DOCX
 * @returns {string} - Cleaned text
 */
const cleanText = (text) => {
  if (!text) return '';

  return text
    // Replace carriage returns with standard newlines
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove zero-width spaces and other invisible characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Replace multiple newlines (3 or more) with just two newlines
    .replace(/\n{3,}/g, '\n\n')
    // Replace multiple spaces/tabs with a single space (except for newlines)
    .replace(/[ \t]+/g, ' ')
    // Trim spaces at the beginning and end of each line
    .replace(/^ +/gm, '')
    .replace(/ +$/gm, '')
    // Finally, trim the entire string
    .trim();
};

module.exports = {
  cleanText
};
