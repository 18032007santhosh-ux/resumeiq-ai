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
  // A naive implementation to look for City, State or Zip Code near the top
  const firstLines = text.split('\n').slice(0, 15).join('\n');
  // Simple regex for "City, State Zip" or similar, just an example
  // In reality, NLP is much better here. We'll use a basic heuristic.
  // We'll leave it as an exercise or just return empty for complex logic, but let's try a simple pattern.
  // Actually, without NLP it's very hard. Let's return '' for now to avoid false positives, 
  // or just look for basic patterns like (City, ST)
  const locationRegex = /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})\b/;
  const match = firstLines.match(locationRegex);
  return match ? match[0] : '';
};

const extractSection = (text, sectionKeywords) => {
  const lines = text.split('\n');
  let startIndex = -1;
  
  // Find start of section
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase().trim();
    if (sectionKeywords.some(keyword => lowerLine === keyword || lowerLine.startsWith(keyword + ' '))) {
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
    if (commonHeaders.some(h => lowerLine === h || lowerLine.startsWith(h + ' '))) {
      endIndex = i;
      break;
    }
  }

  return lines.slice(startIndex + 1, endIndex).join('\n').trim();
};

const extractStructuredData = (text) => {
  const name = text.split('\n')[0].trim(); // Assume first line is name
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const { linkedin, github, portfolio } = extractLinks(text);
  const location = extractLocation(text);

  const summary = extractSection(text, ['summary', 'profile', 'professional summary', 'objective']);
  const educationText = extractSection(text, ['education', 'academic background', 'academic qualifications']);
  const experienceText = extractSection(text, ['experience', 'work experience', 'work history', 'employment history']);
  const projectsText = extractSection(text, ['projects', 'personal projects', 'academic projects']);
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
