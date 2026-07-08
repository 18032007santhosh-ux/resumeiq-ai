// Evaluate: Project title, Description, Technologies, Outcome, GitHub link, Live link
// Max Score: 15

const evaluateProjects = (projects, deductions, improvements) => {
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    deductions.push('No projects section');
    improvements.push('Add a projects section to showcase your practical experience');
    return 0;
  }

  let score = Math.min(projects.length * 3, 6); // Up to 6 points for having projects

  let hasLinks = false;
  let hasDescriptions = false;

  projects.forEach(proj => {
    if (proj.url || proj.github) {
      hasLinks = true;
    }
    
    if (proj.description && proj.description.length > 30) {
      hasDescriptions = true;
    } else if (proj.highlights && proj.highlights.length > 0) {
      hasDescriptions = true;
    }
  });

  if (hasLinks) {
    score += 4;
  } else {
    improvements.push('Add links (GitHub or live URLs) to your projects if possible');
  }

  if (hasDescriptions) {
    score += 5;
  } else {
    deductions.push('Weak project descriptions');
    improvements.push('Improve project descriptions by detailing what you built, the technologies used, and the outcome');
  }

  return Math.min(15, Math.max(0, score));
};

module.exports = { evaluateProjects };
