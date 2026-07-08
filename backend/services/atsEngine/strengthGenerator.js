const generateStrengths = (breakdown, resumeData) => {
  const strengths = [];

  if (breakdown.contact >= 9) {
    strengths.push('Complete and professional contact details');
  }

  if (breakdown.education >= 12) {
    strengths.push('Strong educational background section');
  }

  if (breakdown.experience >= 16) {
    strengths.push('Well-detailed professional experience with strong action verbs');
  } else if (breakdown.experience >= 10 && resumeData.work && resumeData.work.length > 0) {
    strengths.push('Solid foundational work experience');
  }

  if (breakdown.skills >= 16) {
    strengths.push('Comprehensive and diverse technical skill set');
  }

  if (breakdown.projects >= 12) {
    strengths.push('Excellent project portfolio with detailed descriptions');
  }

  if (breakdown.certifications >= 8) {
    strengths.push('Valuable industry certifications included');
  }

  if (breakdown.completeness >= 9) {
    strengths.push('Well-structured and complete resume format');
  }

  if (strengths.length === 0) {
    strengths.push('Good foundation to build upon');
  }

  return strengths;
};

module.exports = { generateStrengths };
