// Evaluate: College, Degree, Branch, Graduation Year, CGPA/Percentage
// Max Score: 15

const evaluateEducation = (education, deductions, improvements) => {
  let score = 0;
  
  if (!education || !Array.isArray(education) || education.length === 0) {
    deductions.push('Missing education section');
    improvements.push('Add your educational background');
    return 0;
  }

  const maxPerEdu = 15 / Math.max(1, education.length);

  education.forEach(edu => {
    let eduScore = maxPerEdu;

    if (!edu.institution || edu.institution.trim() === '') {
      eduScore -= (maxPerEdu * 0.3);
      if (!deductions.includes('Incomplete education (missing institution)')) {
        deductions.push('Incomplete education (missing institution)');
      }
    }
    
    if (!edu.studyType && !edu.area) {
      eduScore -= (maxPerEdu * 0.3);
      if (!deductions.includes('Incomplete education (missing degree or area of study)')) {
        deductions.push('Incomplete education (missing degree or area of study)');
      }
    }

    if (!edu.endDate) {
      eduScore -= (maxPerEdu * 0.2);
      if (!deductions.includes('Missing graduation year')) {
        deductions.push('Missing graduation year');
      }
    }

    if (!edu.score) {
      eduScore -= (maxPerEdu * 0.2);
    }

    score += Math.max(0, eduScore);
  });

  if (score < 10) {
    improvements.push('Ensure all education entries have institution, degree, and graduation dates');
  }

  return Math.min(15, Math.max(0, Math.round(score)));
};

module.exports = { evaluateEducation };
