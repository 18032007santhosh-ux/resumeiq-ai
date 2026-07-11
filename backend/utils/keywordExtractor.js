/**
 * Extracts unique, normalized keywords from a text (like a Job Description).
 * Ignores common stop words and filters out numbers.
 */
const extractKeywords = (text) => {
  if (!text) return [];

  // Stop words to ignore
  const stopWords = new Set([
    'the', 'is', 'with', 'for', 'and', 'or', 'a', 'an', 'to', 'in', 'of', 'at', 'by', 'from', 'on',
    'this', 'that', 'these', 'those', 'it', 'its', 'we', 'us', 'our', 'they', 'them', 'their',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'as', 'if', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'should', 'would', 'about', 'also', 'into', 'out', 'up', 'down', 'are', 'was', 'were'
  ]);

  // Regex matches words, and also allows trailing +, #, or internal dots/dashes (like Node.js, CI/CD, C++, C#)
  const regex = /\b[a-zA-Z0-9+#]+(?:\.[a-zA-Z0-9+#]+)*(?:-[a-zA-Z0-9+#]+)*\b/g;
  
  const matches = text.match(regex) || [];
  const keywords = new Set();

  matches.forEach(match => {
    const clean = match.trim().toLowerCase();
    // Exclude stop words, pure numbers
    if (clean.length > 1 && !stopWords.has(clean) && isNaN(clean)) {
      keywords.add(clean);
    } else if ((clean === 'c' || clean === 'r') && !stopWords.has(clean)) {
      // keep single character tech skills
      keywords.add(clean);
    }
  });

  return Array.from(keywords);
};

module.exports = {
  extractKeywords
};
