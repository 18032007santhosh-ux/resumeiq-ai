const { extractKeywords } = require('./keywordExtractor');

// Predefined skill keywords derived from sectionParsers
const SKILL_KEYWORDS = [
  'java', 'python', 'c++', 'c#', 'c', 'javascript', 'typescript', 'ruby', 'go', 'swift', 'kotlin', 'rust', 'php',
  'html', 'css', 'react', 'node', 'express', 'angular', 'vue', 'next.js', 'django', 'flask', 'spring',
  'sql', 'mysql', 'mongodb', 'postgresql', 'oracle', 'redis', 'firebase',
  'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'arduino', 'jira'
];

/**
 * Calculates ATS scores comparing the parsed resume with the job description.
 */
const calculateScore = (parsedResume, jobDescription) => {
  const jdKeywords = extractKeywords(jobDescription);
  
  if (jdKeywords.length === 0) {
    return {
      overallMatch: 0,
      keywordMatch: 0,
      skillsMatch: 0,
      experienceMatch: 0,
      educationMatch: 0,
      matchedKeywords: [],
      missingKeywords: []
    };
  }

  // 1. Keyword Match (40%)
  const resumeText = (parsedResume.rawText || '').toLowerCase();
  
  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywords.forEach(kw => {
    const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
    if (regex.test(resumeText)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordMatch = jdKeywords.length > 0 
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100) 
    : 100;

  // 2. Skills Match (30%)
  const jdSkills = jdKeywords.filter(kw => SKILL_KEYWORDS.includes(kw));
  let skillsMatch = 100;
  if (jdSkills.length > 0) {
    const matchedSkills = jdSkills.filter(skill => {
      const resumeSkillsText = (parsedResume.skills || []).join(' ').toLowerCase();
      return resumeSkillsText.includes(skill);
    });
    skillsMatch = Math.round((matchedSkills.length / jdSkills.length) * 100);
  } else {
    skillsMatch = parsedResume.skills && parsedResume.skills.length > 0 ? 100 : 50;
  }

  // 3. Experience Match (20%)
  let experienceMatch = 0;
  if (parsedResume.experience && parsedResume.experience.length > 0) {
    experienceMatch = 50; 
    const expText = parsedResume.experience.map(e => e.description || '').join(' ').toLowerCase();
    const matchedExpKw = jdKeywords.filter(kw => expText.includes(kw));
    const relevanceScore = jdKeywords.length > 0 ? (matchedExpKw.length / jdKeywords.length) * 50 : 50;
    experienceMatch = Math.min(100, Math.round(experienceMatch + relevanceScore));
  } else {
    experienceMatch = 30;
  }

  // 4. Education Match (10%)
  let educationMatch = 0;
  if (parsedResume.education && parsedResume.education.length > 0) {
    educationMatch = 70;
    const eduText = parsedResume.education.map(e => (e.degree || '') + ' ' + (e.description || '')).join(' ').toLowerCase();
    const degrees = ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'bsc', 'msc', 'diploma', 'degree'];
    const jdMentionedDegrees = degrees.filter(deg => jobDescription.toLowerCase().includes(deg));
    
    if (jdMentionedDegrees.length > 0) {
      const match = jdMentionedDegrees.some(deg => eduText.includes(deg));
      if (match) {
        educationMatch = 100;
      } else {
        educationMatch = 80;
      }
    } else {
      educationMatch = 100;
    }
  } else {
    educationMatch = 0;
  }

  const overallMatch = Math.round(
    (keywordMatch * 0.40) +
    (skillsMatch * 0.30) +
    (experienceMatch * 0.20) +
    (educationMatch * 0.10)
  );

  return {
    overallMatch,
    keywordMatch,
    skillsMatch,
    experienceMatch,
    educationMatch,
    matchedKeywords,
    missingKeywords
  };
};

module.exports = {
  calculateScore
};
