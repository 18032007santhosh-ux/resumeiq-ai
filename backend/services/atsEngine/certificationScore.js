// Evaluate: Number, Provider, Recognized certifications
// Max Score: 10

const evaluateCertifications = (certifications, deductions, improvements) => {
  if (!certifications || !Array.isArray(certifications) || certifications.length === 0) {
    improvements.push('Consider adding relevant certifications to boost your profile');
    return 0; // Don't deduct for no certifications, as they are optional for many roles
  }

  let score = Math.min(certifications.length * 3, 6); // Up to 6 points for quantity

  let hasProvider = false;
  certifications.forEach(cert => {
    if (cert.issuer) {
      hasProvider = true;
    }
  });

  if (hasProvider) {
    score += 4; // Bonus for having proper issuing organizations
  } else {
    improvements.push('Include the issuing organization (e.g., Coursera, AWS) for all certifications');
  }

  return Math.min(10, Math.max(0, score));
};

module.exports = { evaluateCertifications };
