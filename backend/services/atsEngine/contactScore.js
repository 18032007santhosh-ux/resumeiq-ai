// Evaluate: Name, Email, Phone, LinkedIn, GitHub, Location
// Max Score: 10

const evaluateContact = (basics, deductions, improvements) => {
  let score = 10;
  
  if (!basics) {
    deductions.push('Missing contact information section completely');
    improvements.push('Add a contact information section');
    return 0;
  }

  if (!basics.name || basics.name.trim() === '') {
    score -= 2;
    deductions.push('Missing name');
    improvements.push('Add your full name to the resume');
  }

  if (!basics.email || basics.email.trim() === '') {
    score -= 2;
    deductions.push('Missing email address');
    improvements.push('Add a professional email address');
  }

  if (!basics.phone || basics.phone.trim() === '') {
    score -= 2;
    deductions.push('Missing phone number');
    improvements.push('Include a phone number so recruiters can reach you');
  }

  const hasLinkedIn = basics.profiles && basics.profiles.some(p => p.network && p.network.toLowerCase().includes('linkedin'));
  if (!hasLinkedIn) {
    score -= 2;
    deductions.push('Missing LinkedIn profile');
    improvements.push('Add a LinkedIn URL to showcase your professional network');
  }

  const hasGitHub = basics.profiles && basics.profiles.some(p => p.network && p.network.toLowerCase().includes('github'));
  if (!hasGitHub) {
    score -= 1;
    deductions.push('Missing GitHub profile');
    improvements.push('Add a GitHub profile to showcase your code (especially for tech roles)');
  }

  if (!basics.location || !basics.location.city || basics.location.city.trim() === '') {
    score -= 1;
    deductions.push('Missing location');
    improvements.push('Add your city and state/country to help recruiters match you with local or remote roles');
  }

  return Math.max(0, score);
};

module.exports = { evaluateContact };
