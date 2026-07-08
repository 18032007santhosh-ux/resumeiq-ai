const { evaluateContact } = require('./contactScore');
const { evaluateEducation } = require('./educationScore');
const { evaluateExperience } = require('./experienceScore');
const { evaluateSkills } = require('./skillsScore');
const { evaluateProjects } = require('./projectsScore');
const { evaluateCertifications } = require('./certificationScore');
const { evaluateCompleteness } = require('./completenessScore');
const { generateStrengths } = require('./strengthGenerator');
const { finalizeImprovements } = require('./improvementGenerator');
const { finalizeIssues } = require('./deductions');

const analyze = (resumeData) => {
  const deductions = [];
  const improvements = [];

  const contact = evaluateContact(resumeData.basics, deductions, improvements);
  const education = evaluateEducation(resumeData.education, deductions, improvements);
  const experience = evaluateExperience(resumeData.work, deductions, improvements); // JSON resume uses 'work'
  const skills = evaluateSkills(resumeData.skills, deductions, improvements);
  const projects = evaluateProjects(resumeData.projects, deductions, improvements);
  const certifications = evaluateCertifications(resumeData.certificates || resumeData.certifications, deductions, improvements); // handles both keys
  const completeness = evaluateCompleteness(resumeData, deductions, improvements);

  const breakdown = {
    contact,
    education,
    experience,
    skills,
    projects,
    certifications,
    completeness,
  };

  const overallScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
  
  const strengths = generateStrengths(breakdown, resumeData);
  const finalizedImprovements = finalizeImprovements(improvements);
  const finalizedIssues = finalizeIssues(deductions);

  return {
    score: overallScore,
    breakdown,
    strengths,
    improvements: finalizedImprovements,
    issues: finalizedIssues,
  };
};

module.exports = { analyze };
