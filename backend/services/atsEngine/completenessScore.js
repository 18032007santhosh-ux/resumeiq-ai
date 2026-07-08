// Evaluate: Empty sections, Formatting, Section availability, Required information
// Max Score: 10

const evaluateCompleteness = (resumeData, deductions, improvements) => {
  let score = 10;
  
  const sections = ['basics', 'education', 'work', 'skills', 'projects']; // Core sections
  
  sections.forEach(sec => {
    if (!resumeData[sec] || (Array.isArray(resumeData[sec]) && resumeData[sec].length === 0)) {
      score -= 2; // Deduct 2 points for each missing core section
    }
  });

  // Short resume check (approximate based on data volume)
  let dataPoints = 0;
  if (resumeData.work) dataPoints += resumeData.work.length * 3;
  if (resumeData.education) dataPoints += resumeData.education.length * 2;
  if (resumeData.projects) dataPoints += resumeData.projects.length * 2;
  
  if (dataPoints < 5) {
    deductions.push('Very short resume');
    improvements.push('Expand your resume by adding more details to your experience, projects, or education sections');
    score -= 3;
  }

  return Math.max(0, score);
};

module.exports = { evaluateCompleteness };
