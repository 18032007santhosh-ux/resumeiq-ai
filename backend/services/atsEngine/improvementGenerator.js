// improvements array is populated during scoring, this file can deduplicate and prioritize them
const finalizeImprovements = (improvements) => {
  // Remove duplicates
  const uniqueImprovements = [...new Set(improvements)];
  
  // Return top 5-7 improvements so we don't overwhelm the user
  return uniqueImprovements.slice(0, 7);
};

module.exports = { finalizeImprovements };
