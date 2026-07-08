// Evaluate: Technical Skills, Programming Languages, Frameworks, Libraries, Databases, Tools, Soft Skills
// Max Score: 20

const evaluateSkills = (skills, deductions, improvements) => {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    deductions.push('Missing skills section');
    improvements.push('Add a skills section listing your technical and soft skills');
    return 0;
  }

  let allSkills = [];
  skills.forEach(skillObj => {
    if (skillObj.keywords && Array.isArray(skillObj.keywords)) {
      allSkills.push(...skillObj.keywords.map(k => k.toLowerCase().trim()));
    }
  });

  if (allSkills.length === 0) {
    deductions.push('Empty skills list');
    improvements.push('List specific skills (e.g., JavaScript, Project Management) rather than just categories');
    return 0;
  }

  // Check for duplicates
  const uniqueSkills = [...new Set(allSkills)];
  if (uniqueSkills.length < allSkills.length) {
    deductions.push('Duplicate skills detected');
  }

  let score = 0;
  
  if (uniqueSkills.length > 20) {
    score = 20;
  } else if (uniqueSkills.length > 10) {
    score = 15;
  } else if (uniqueSkills.length > 5) {
    score = 10;
  } else {
    score = 5;
    improvements.push('Increase the number of technical and professional skills on your resume');
  }

  // Bonus for categorized skills if they used proper JSON resume format
  if (skills.length > 1) {
    score += 2; // Extra points for categorizing skills
  } else {
    improvements.push('Categorize your skills (e.g., Languages, Frameworks, Tools) for better readability');
  }

  return Math.min(20, Math.max(0, score));
};

module.exports = { evaluateSkills };
