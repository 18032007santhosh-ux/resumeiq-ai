const extractEmail = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
};

const extractPhone = (text) => {
  const phoneRegex = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
};

const extractLinks = (text) => {
  const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/g;
  const matches = text.match(urlRegex) || [];
  let linkedin = '', github = '', portfolio = '';
  matches.forEach(url => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('linkedin.com')) linkedin = url;
    else if (lowerUrl.includes('github.com')) github = url;
    else if (!portfolio) portfolio = url;
  });
  return { linkedin, github, portfolio };
};

const parsePersonalInfo = (text) => {
  const lines = text.split('\n');
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const { linkedin, github, portfolio } = extractLinks(text);

  let name = '';
  const topLines = lines.slice(0, 10).map(l => l.trim()).filter(l => l.length > 0);
  const commonHeaders = ['summary', 'profile', 'objective', 'education', 'experience', 'projects', 'skills', 'contact'];
  
  for (const line of topLines) {
    const lowerLine = line.toLowerCase().replace(/:$/, '');
    if (!commonHeaders.includes(lowerLine) && line.length > 2 && line.length < 50 && !line.includes('@') && !/\d{5,}/.test(line)) {
      name = line;
      break;
    }
  }

  // Smarter Location Extraction
  let location = '';
  const addressKeywords = /\b(street|st|road|rd|avenue|ave|cross|nagar|colony|layout|district|dist|city|state|apartment|apt|floor|building|block|sector|phase|pin|pincode|zip|madurai|chennai|coimbatore|bangalore|bengaluru|hyderabad|mumbai|delhi|pune|kolkata)\b/i;
  const pinCode = /\b\d{5,6}\b\s*[.,]?\s*$/;
  
  for (const line of lines) {
    if (addressKeywords.test(line) || pinCode.test(line)) {
      if (!line.includes('@') && line.length >= 5 && line.length <= 100) {
        const letters = line.replace(/[^a-zA-Z]/g, '');
        if (letters.length >= 5) {
          location = line.trim();
          break;
        }
      }
    }
  }

  if (!location) {
    let contactIdx = lines.findIndex(l => l.includes('@') || /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(l));
    if (contactIdx !== -1) {
      for (const offset of [-1, 1, -2, 2]) {
        const idx = contactIdx + offset;
        if (idx >= 0 && idx < lines.length) {
          const line = lines[idx].trim();
          const letters = line.replace(/[^a-zA-Z]/g, '');
          if (line.length > 5 && line.length < 60 && letters.length > 5 && !line.includes('@') && !/^\d+$/.test(line.replace(/\D/g, ''))) {
            const lower = line.toLowerCase();
            if (!lower.includes('contact') && !lower.includes('profile')) {
              location = line;
              break;
            }
          }
        }
      }
    }
  }

  return { name, email, phone, location, linkedin, github, portfolio };
};

const parseEducation = (text) => {
  if (!text) return [];
  const educationList = [];
  
  // Split into blocks by double newline or bullet points, or just try to parse the whole text if it's contiguous
  // A simple way is to chunk by lines that look like degrees or colleges.
  const blocks = text.split(/\n\n+/).filter(b => b.trim().length > 0);
  
  // Fallback to one block if no double newlines
  const processingBlocks = blocks.length > 0 ? blocks : [text];
  
  const degreeRegex = /\b(B\.?E\.?|B\.?Tech\.?|M\.?Tech\.?|B\.?Sc\.?|M\.?Sc\.?|B\.?A\.?|M\.?A\.?|Bachelor|Master|PhD|Diploma|Degree|10th|12th|Standard|Std)\b/i;
  const branchRegex = /\b(Computer Science|Information Technology|Mechanical|Electrical|Electronics|Civil|AI|Data Science|CSE|IT|ECE|EEE|MECH)\b/i;
  const cgpaRegex = /\b(?:CGPA|GPA|Percentage|%|Marks)[\s:]*([0-9]{1,2}(?:\.[0-9]{1,2})?)\b/i;
  const yearRegex = /\b(19\d{2}|20\d{2})(?:\s*(?:-|to|till)\s*(19\d{2}|20\d{2}|present))?\b/i;

  processingBlocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    
    let degree = '', institution = '', branch = '', year = '', cgpa = '';
    
    lines.forEach(line => {
      if (degreeRegex.test(line) && !degree) degree = line;
      else if (branchRegex.test(line) && !branch) branch = line;
      else if (/college|university|school|institute/i.test(line) && !institution) institution = line;
      
      const yearMatch = line.match(yearRegex);
      if (yearMatch && !year) year = yearMatch[0];
      
      const cgpaMatch = line.match(cgpaRegex);
      if (cgpaMatch && !cgpa) cgpa = cgpaMatch[1];
    });

    if (degree || institution || cgpa) {
      educationList.push({
        degree: degree || branch,
        institution: institution || (degreeRegex.test(lines[0]) ? '' : lines[0]),
        year,
        cgpa,
        description: block
      });
    } else if (degreeRegex.test(block) || /college|university|school|institute/i.test(block)) {
      educationList.push({ description: block });
    }
  });

  return educationList;
};

const parseExperience = (text) => {
  if (!text) return [];
  // Verify it's actually experience (needs a date range)
  const dateRangeRegex = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?[a-z]*\s*\d{4}\s*(?:-|to|–)\s*(?:present|current|till date|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?[a-z]*\s*\d{4})\b/i;

  if (!dateRangeRegex.test(text)) {
    // Highly likely a false positive if no date range is found
    return [];
  }

  const blocks = text.split(/\n\n+/).filter(b => b.trim().length > 0);
  return (blocks.length > 0 ? blocks : [text]).map(b => ({ description: b }));
};

const parseProjects = (text) => {
  if (!text) return [];
  const blocks = text.split(/\n\n+|(?=\b(?:Project|Title):\s)/i).filter(b => b.trim().length > 0);
  
  return blocks.map(block => {
    const lines = block.split('\n');
    const titleRegex = /(?:Project|Title)?[\s:-]*([A-Za-z0-9\s]+)/i;
    let title = lines[0].match(titleRegex) ? lines[0].match(titleRegex)[1].trim() : lines[0];
    
    const techRegex = /(?:Technologies|Tech Stack|Tools)[\s:-]*(.+)/i;
    let technologies = '';
    
    lines.forEach(line => {
      const match = line.match(techRegex);
      if (match) technologies = match[1].trim();
    });

    return {
      title,
      technologies,
      description: block
    };
  });
};

const parseSkills = (text) => {
  if (!text) return [];
  
  const skillCategories = {
    'Programming Languages': ['Java', 'Python', 'C++', 'C#', 'C', 'JavaScript', 'TypeScript', 'Ruby', 'Go', 'Swift', 'Kotlin', 'Rust', 'PHP'],
    'Web Technologies': ['HTML', 'CSS', 'React', 'Node', 'Express', 'Angular', 'Vue', 'Next.js', 'Django', 'Flask', 'Spring'],
    'Databases': ['SQL', 'MySQL', 'MongoDB', 'PostgreSQL', 'Oracle', 'Redis', 'Firebase'],
    'Tools & Platforms': ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Arduino', 'Jira']
  };

  const foundSkills = {
    'Programming Languages': new Set(),
    'Web Technologies': new Set(),
    'Databases': new Set(),
    'Tools & Platforms': new Set(),
    'Other': new Set()
  };

  // Find known skills
  const normalizedText = text.toLowerCase();
  for (const [category, skillsList] of Object.entries(skillCategories)) {
    for (const skill of skillsList) {
      // Use regex to avoid partial word matches (e.g. matching 'C' in 'React')
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        foundSkills[category].add(skill);
      }
    }
  }

  // Attempt to grab any comma-separated lists that might be explicit skills
  const rawSkills = text.split(/[,|•\n]+/).map(s => s.trim().replace(/^[-*]\s*/, '')).filter(s => s.length > 0 && s.length < 40);
  for (const raw of rawSkills) {
    let categorized = false;
    for (const [cat, set] of Object.entries(foundSkills)) {
      if (cat !== 'Other' && Array.from(set).some(s => s.toLowerCase() === raw.toLowerCase())) {
        categorized = true;
        break;
      }
    }
    // Only add to 'Other' if it doesn't contain a colon (like "Programming Languages: Java")
    if (!categorized && !raw.includes(':') && raw.split(' ').length <= 4) {
      foundSkills['Other'].add(raw);
    }
  }

  const result = [];
  for (const [category, set] of Object.entries(foundSkills)) {
    if (set.size > 0) {
      if (category === 'Other') {
        result.push(...Array.from(set));
      } else {
        result.push(`${category}: ${Array.from(set).join(', ')}`);
      }
    }
  }

  return result;
};

const parseAchievements = (text) => {
  if (!text) return [];
  return text.split(/\n/).map(a => a.trim().replace(/^[-*•]\s*/, '')).filter(a => a.length > 0);
};

const parseSummary = (text) => {
  return text ? text.replace(/^[-*•]\s*/, '').trim() : '';
};

module.exports = {
  parsePersonalInfo,
  parseEducation,
  parseExperience,
  parseProjects,
  parseSkills,
  parseAchievements,
  parseSummary
};
