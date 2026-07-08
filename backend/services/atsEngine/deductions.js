// deductions array is populated during scoring, this just finalizes them (issues)
const finalizeIssues = (deductions) => {
  // Remove duplicates
  return [...new Set(deductions)];
};

module.exports = { finalizeIssues };
