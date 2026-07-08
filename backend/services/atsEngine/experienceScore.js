// Evaluate: Number of jobs, Role, Company, Duration, Bullet points, Action verbs
// Max Score: 20

const actionVerbs = ['developed', 'led', 'managed', 'created', 'designed', 'built', 'implemented', 'improved', 'reduced', 'increased', 'optimized', 'resolved'];

const evaluateExperience = (experience, deductions, improvements) => {
  if (!experience || !Array.isArray(experience) || experience.length === 0) {
    deductions.push('Empty experience section');
    improvements.push('Add work experience, internships, or volunteer work to improve your score');
    // Students without experience get 10 out of 20 to avoid zeroing out their score completely
    return 10; 
  }

  let score = 10; // Base score for having experience

  const jobs = Math.min(experience.length, 3);
  score += (jobs * 2); // Up to 6 points for having multiple jobs

  let hasGoodDescriptions = false;
  let hasActionVerbs = false;
  let hasIncompleteEntry = false;

  experience.forEach(exp => {
    if (!exp.position || !exp.name) {
      hasIncompleteEntry = true;
    }

    if (exp.highlights && exp.highlights.length > 0) {
      if (exp.highlights.length >= 3) {
        hasGoodDescriptions = true;
      }
      
      const combinedHighlights = exp.highlights.join(' ').toLowerCase();
      if (actionVerbs.some(verb => combinedHighlights.includes(verb))) {
        hasActionVerbs = true;
      }
    } else if (exp.summary && exp.summary.length > 20) {
      hasGoodDescriptions = true;
      if (actionVerbs.some(verb => exp.summary.toLowerCase().includes(verb))) {
        hasActionVerbs = true;
      }
    }
  });

  if (hasGoodDescriptions) {
    score += 2;
  } else {
    deductions.push('Weak experience descriptions');
    improvements.push('Add detailed bullet points (3-5 per job) describing your responsibilities and achievements');
  }

  if (hasActionVerbs) {
    score += 2;
  } else {
    improvements.push('Use strong action verbs (e.g., Developed, Managed, Optimized) in your experience descriptions');
  }

  if (hasIncompleteEntry) {
    score -= 2;
    deductions.push('Incomplete experience entries');
    improvements.push('Ensure all experience entries have a company name and job title');
  }

  return Math.min(20, Math.max(0, score));
};

module.exports = { evaluateExperience };
