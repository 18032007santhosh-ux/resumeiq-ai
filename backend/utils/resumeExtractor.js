/**
 * Extracts structured information from cleaned resume text.
 * Note: This is a rule-based parser and will not be 100% accurate for all layouts.
 */

const { 
  parsePersonalInfo,
  parseEducation,
  parseExperience,
  parseProjects,
  parseSkills,
  parseAchievements,
  parseSummary
} = require('./sectionParsers');

const extractStructuredData = (text) => {
  if (!text) return {};

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // 1. Configurable Section Dictionary
  const sectionDictionary = {
    'summary': 'summary',
    'profile': 'summary',
    'professional summary': 'summary',
    'objective': 'summary',
    'about me': 'summary',
    'education': 'education',
    'academic background': 'education',
    'academic qualifications': 'education',
    'school': 'education',
    'college': 'education',
    'experience': 'experience',
    'work experience': 'experience',
    'work history': 'experience',
    'employment history': 'experience',
    'projects': 'projects',
    'project': 'projects',
    'personal projects': 'projects',
    'academic projects': 'projects',
    'skills': 'skills',
    'technical skills': 'skills',
    'core competencies': 'skills',
    'certifications': 'certifications',
    'certificates': 'certifications',
    'achievements': 'achievements',
    'awards': 'achievements',
    'honors': 'achievements',
    'languages': 'languages',
    'languages known': 'languages',
    'contact': 'contact info',
    'contact info': 'contact info',
    'strength': 'skills',
    'strengths': 'skills'
  };

  // 2. Block Chunking
  const blocks = {
    personal_info: [],
    summary: [],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    languages: []
  };

  let currentSection = 'personal_info';

  for (const line of lines) {
    const lowerLine = line.toLowerCase().replace(/:$/, '');
    
    if (line.length < 40 && sectionDictionary[lowerLine]) {
      currentSection = sectionDictionary[lowerLine];
      continue;
    }
    
    if (line.length > 2 && line.length < 30 && line === line.toUpperCase() && !/^[0-9\W]+$/.test(line)) {
       const matchedKey = Object.keys(sectionDictionary).find(k => lowerLine.includes(k));
       if (matchedKey) {
          currentSection = sectionDictionary[matchedKey];
          continue;
       }
    }

    if (blocks[currentSection]) {
      blocks[currentSection].push(line);
    }
  }

  const sectionTexts = {};
  for (const [key, linesArr] of Object.entries(blocks)) {
    sectionTexts[key] = linesArr.join('\n');
  }

  // 3. Dispatch to Parsers
  // Personal Info can be anywhere (headers/footers/margins), so we pass the full text
  const personalInfo = parsePersonalInfo(text);
  
  let education = parseEducation(sectionTexts.education);
  if (education.length === 0) education = parseEducation(sectionTexts.summary);
  if (education.length === 0) education = parseEducation(sectionTexts.personal_info);

  let experience = parseExperience(sectionTexts.experience);
  if (experience.length === 0) experience = parseExperience(sectionTexts.summary);
  if (experience.length === 0) experience = parseExperience(sectionTexts.personal_info);

  let projects = parseProjects(sectionTexts.projects);
  if (projects.length === 0) projects = parseProjects(sectionTexts.summary);
  if (projects.length === 0) projects = parseProjects(sectionTexts.personal_info);

  const skills = parseSkills(sectionTexts.skills);
  const certifications = parseAchievements(sectionTexts.certifications);
  const achievements = parseAchievements(sectionTexts.achievements);
  const summary = parseSummary(sectionTexts.summary) || (personalInfo.summary || '');
  const languages = parseAchievements(sectionTexts.languages);

  // Confidence scores for ATS compatibility (rough estimations based on presence)
  const confidenceScores = {
    name: personalInfo.name ? 0.9 : 0.0,
    email: personalInfo.email ? 0.9 : 0.0,
    phone: personalInfo.phone ? 0.9 : 0.0,
    location: personalInfo.location ? 0.8 : 0.0,
    education: education.length > 0 ? 1.0 : 0.0,
    experience: experience.length > 0 ? 1.0 : 0.0,
    projects: projects.length > 0 ? 1.0 : 0.0,
    skills: skills.length > 0 ? 1.0 : 0.0,
    certifications: certifications.length > 0 ? 1.0 : 0.0,
  };

  // 4. Assemble Final JSON
  return {
    name: personalInfo.name,
    email: personalInfo.email,
    phone: personalInfo.phone,
    location: personalInfo.location,
    linkedin: personalInfo.linkedin,
    github: personalInfo.github,
    portfolio: personalInfo.portfolio,
    summary,
    education,
    experience,
    projects,
    skills,
    certifications,
    achievements,
    languages,
    confidenceScores
  };
};

module.exports = {
  extractStructuredData
};
