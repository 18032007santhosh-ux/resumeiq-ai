/**
 * Extracts structured information from cleaned resume text.
 * Note: This is a rule-based parser and will not be 100% accurate for all layouts.
 */

const extractEmail = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
};

const extractPhone = (text) => {
  // Matches basic international and US formats, e.g. +1 123-456-7890, (123) 456-7890
  const phoneRegex = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
};

const extractLinks = (text) => {
  const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/g;
  const matches = text.match(urlRegex) || [];
  
  let linkedin = '';
  let github = '';
  let portfolio = '';

  matches.forEach(url => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('linkedin.com')) linkedin = url;
    else if (lowerUrl.includes('github.com')) github = url;
    else if (!portfolio) portfolio = url; // assign first non-linkedin/github as portfolio
  });

  return { linkedin, github, portfolio };
};

const extractLocation = (text) => {
  // Focus on the top of the resume for location
  const firstLines = text.split('\n').slice(0, 15).join('\n');
  
  // Specific address keywords
  const locationRegex1 = /(?:location|address|residence)[\s:]*([A-Za-z0-9\s,.-]+)/i;
  let match = firstLines.match(locationRegex1);
  if (match) return match[1].trim();
  
  // Match City, State Zip or just City, State
  const locationRegex2 = /([A-Z][a-zA-Z\s]+),\s*([A-Z]{2}|[A-Z][a-zA-Z\s]+)(?:\s+\d{5,6})?/i;
  match = firstLines.match(locationRegex2);
  if (match && match[0].length < 50) return match[0].trim();
  
  return '';
};

const extractSection = (text, sectionKeywords) => {
  const lines = text.split('\n');
  let startIndex = -1;
  
  // Find start of section
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase().trim();
    if (sectionKeywords.some(keyword => lowerLine === keyword || lowerLine.startsWith(keyword + ' ') || lowerLine.startsWith(keyword + ':'))) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) return '';

  // Find end of section (next ALL CAPS line or known section header)
  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // If the line is short and uppercase, it might be a new section heading
    if (line.length > 0 && line.length < 30 && line === line.toUpperCase() && !/^[0-9\W]+$/.test(line)) {
       endIndex = i;
       break;
    }
    
    // Or if it matches common section keywords
    const commonHeaders = ['education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'languages', 'summary', 'profile', 'work history'];
    if (commonHeaders.some(h => lowerLine === h || lowerLine.startsWith(h + ' ') || lowerLine.startsWith(h + ':'))) {
      endIndex = i;
      break;
    }
  }

  return lines.slice(startIndex + 1, endIndex).join('\n').trim();
};

/**
 * Extracts contiguous blocks of text around lines that match a specific regex.
 */
const extractContextBlocks = (text, regex, before = 1, after = 3) => {
  const lines = text.split('\n');
  const matchedIndices = new Set();
  
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      for (let j = Math.max(0, i - before); j <= Math.min(lines.length - 1, i + after); j++) {
        if (lines[j].trim().length > 0) {
          matchedIndices.add(j);
        }
      }
    }
  }
  
  const sortedIndices = Array.from(matchedIndices).sort((a, b) => a - b);
  if (sortedIndices.length === 0) return '';
  
  let result = [];
  let currentBlock = [];
  let lastIndex = -2;
  
  for (const idx of sortedIndices) {
    if (lastIndex !== -2 && idx > lastIndex + 1) {
       result.push(currentBlock.join('\n'));
       currentBlock = [];
    }
    currentBlock.push(lines[idx].trim());
    lastIndex = idx;
  }
  if (currentBlock.length > 0) {
    result.push(currentBlock.join('\n'));
  }
  
  return result.join('\n\n');
};

const extractEducationByPattern = (text) => {
  // Match degrees, universities, or CGPA
  const eduKeywords = /\b(b\.?e\.?|b\.?tech\.?|m\.?tech\.?|b\.?sc\.?|bachelor|master|phd|university|college|institute|cgpa|gpa|diploma|degree)\b/i;
  // Also match graduation years like "Class of 2024", "Graduated 2023"
  const gradYear = /\b(class of|graduated|graduation).*\d{4}\b/i;
  
  const combinedRegex = new RegExp(`(?:${eduKeywords.source}|${gradYear.source})`, 'i');
  return extractContextBlocks(text, combinedRegex, 1, 3);
};

const extractExperienceByPattern = (text) => {
  // Match date ranges commonly used in experience sections
  const dateRangeRegex = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?[a-z]*\s*\d{4}\s*(?:-|to|–)\s*(?:present|current|till date|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?[a-z]*\s*\d{4})\b/i;
  // Match common job titles or company indicators
  const jobKeywords = /\b(engineer|developer|manager|intern|consultant|analyst|ltd|inc|llc|company|corp|pvt)\b/i;
  
  const combinedRegex = new RegExp(`(?:${dateRangeRegex.source}|${jobKeywords.source})`, 'i');
  
  // We only want to capture blocks where BOTH a date and a job/company keyword exist nearby, 
  // but to keep it simple and robust, matching either is often enough if no headers exist.
  // We'll extract blocks for both and rely on the UI to display them nicely.
  return extractContextBlocks(text, combinedRegex, 2, 4);
};

const extractProjectsByPattern = (text) => {
  // Projects often have tech stacks, "Built", "Developed", or "GitHub" references
  const projectRegex = /\b(built|developed|created|designed|implemented|github|repository|app|application|system|platform)\b/i;
  return extractContextBlocks(text, projectRegex, 1, 3);
};

const extractStructuredData = (text) => {
  const name = text.split('\n')[0].trim(); // Assume first line is name
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const { linkedin, github, portfolio } = extractLinks(text);
  const location = extractLocation(text);

  const summary = extractSection(text, ['summary', 'profile', 'professional summary', 'objective']);
  
  // Education fallback
  let educationText = extractSection(text, ['education', 'academic background', 'academic qualifications']);
  if (!educationText) educationText = extractEducationByPattern(text);
  
  // Experience fallback
  let experienceText = extractSection(text, ['experience', 'work experience', 'work history', 'employment history']);
  if (!experienceText) experienceText = extractExperienceByPattern(text);
  
  // Projects fallback
  let projectsText = extractSection(text, ['projects', 'personal projects', 'academic projects']);
  if (!projectsText) projectsText = extractProjectsByPattern(text);
  
  const skillsText = extractSection(text, ['skills', 'technical skills', 'core competencies']);
  const certificationsText = extractSection(text, ['certifications', 'certificates']);
  const achievementsText = extractSection(text, ['achievements', 'awards', 'honors']);
  const languagesText = extractSection(text, ['languages', 'languages known']);

  return {
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    portfolio,
    summary,
    education: educationText ? [{ description: educationText }] : [], // Naive extraction, full structuring requires NLP
    experience: experienceText ? [{ description: experienceText }] : [],
    projects: projectsText ? [{ description: projectsText }] : [],
    skills: skillsText ? skillsText.split(/[,•|\n]+/).map(s => s.trim()).filter(s => s.length > 0) : [],
    certifications: certificationsText ? certificationsText.split('\n').map(c => c.trim()).filter(c => c.length > 0) : [],
    achievements: achievementsText ? achievementsText.split('\n').map(a => a.trim()).filter(a => a.length > 0) : [],
    languages: languagesText ? languagesText.split(/[,•|\n]+/).map(l => l.trim()).filter(l => l.length > 0) : []
  };
};

module.exports = {
  extractStructuredData
};
