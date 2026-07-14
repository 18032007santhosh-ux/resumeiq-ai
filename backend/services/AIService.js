const { GoogleGenAI } = require('@google/genai');

/**
 * Generate suggestions for a resume based on ATS analysis and parsed data.
 */
const generateSuggestions = async (parsedResume, atsScore, atsBreakdown, strengthsList, improvementsList, issuesList) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a professional resume writer and career coach.
Analyze the following resume and its ATS breakdown to provide specific improvement suggestions.

Resume Data:
${JSON.stringify(parsedResume, null, 2)}

ATS Score: ${atsScore} / 100

ATS Breakdown:
${JSON.stringify(atsBreakdown, null, 2)}

ATS Strengths detected:
${JSON.stringify(strengthsList, null, 2)}

ATS Areas for Improvement:
${JSON.stringify(improvementsList, null, 2)}

ATS Issues detected:
${JSON.stringify(issuesList, null, 2)}

Based on this information, provide:
1. Overall feedback on the resume.
2. 3-5 specific strengths.
3. 3-5 specific improvements.
4. Detailed suggestions for each section (Summary, Skills, Experience, Projects, Education, Certifications).
5. 5-10 missing keywords (industry-specific tech skills/methodologies) that would boost ATS score.
6. A concrete checklist of action items.

You MUST follow the schema. Do not write any markdown or HTML.`;

  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              overallFeedback: { type: 'STRING' },
              strengths: { type: 'ARRAY', items: { type: 'STRING' } },
              improvements: { type: 'ARRAY', items: { type: 'STRING' } },
              sectionSuggestions: {
                type: 'OBJECT',
                properties: {
                  summary: { type: 'STRING' },
                  skills: { type: 'STRING' },
                  experience: { type: 'STRING' },
                  projects: { type: 'STRING' },
                  education: { type: 'STRING' },
                  certifications: { type: 'STRING' },
                },
                required: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
              },
              missingKeywords: { type: 'ARRAY', items: { type: 'STRING' } },
              actionItems: { type: 'ARRAY', items: { type: 'STRING' } },
            },
            required: ['overallFeedback', 'strengths', 'improvements', 'sectionSuggestions', 'missingKeywords', 'actionItems'],
          }
        }
      });

      const parsed = JSON.parse(response.text);
      
      // Validate response fields
      if (!parsed.overallFeedback || 
          !Array.isArray(parsed.strengths) || 
          !Array.isArray(parsed.improvements) || 
          !parsed.sectionSuggestions ||
          !parsed.sectionSuggestions.summary ||
          !parsed.sectionSuggestions.skills ||
          !parsed.sectionSuggestions.experience ||
          !parsed.sectionSuggestions.projects ||
          !parsed.sectionSuggestions.education ||
          !parsed.sectionSuggestions.certifications ||
          !Array.isArray(parsed.missingKeywords) ||
          !Array.isArray(parsed.actionItems)) {
        throw new Error('Invalid JSON structure returned by Gemini API');
      }

      // Check for Markdown or HTML
      const hasMarkdownOrHtml = (str) => /[*_`#<>]|href=/i.test(str);
      if (hasMarkdownOrHtml(parsed.overallFeedback)) {
        throw new Error('Response contains markdown or HTML, which is not allowed');
      }

      return parsed;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to generate suggestions:`, error.message);
      if (attempts >= 2) {
        throw error;
      }
    }
  }
};

/**
 * Generate suggestions for matching a resume to a specific job description.
 */
const generateJobMatchSuggestions = async (parsedResume, jobDescription) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a professional ATS optimizer and career coach.
Analyze the following resume and the provided Job Description to suggest improvements that will make the resume a better match for the job.

Resume Data:
${JSON.stringify(parsedResume, null, 2)}

Job Description:
${jobDescription}

Based on this information, provide 3-5 highly specific, actionable, and concise recommendations (e.g., "Mention Docker experience if applicable." or "Highlight REST API projects.").
You MUST follow the schema. Do not write any markdown or HTML.`;

  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              recommendations: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              }
            },
            required: ['recommendations'],
          }
        }
      });

      const parsed = JSON.parse(response.text);
      
      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        throw new Error('Invalid JSON structure returned by Gemini API');
      }

      return parsed.recommendations;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to generate job match suggestions:`, error.message);
      if (attempts >= 2) {
        throw error;
      }
    }
  }
};

/**
 * Generate interview questions based on resume, job description, difficulty, and quantity.
 */
const generateInterviewQuestions = async ({
  parsedResume,
  atsAnalysis = null,
  jobDescription = null,
  jobMatchScore = null,
  difficulty = 'Intermediate',
  questionCount = 10,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert interviewer. Generate exactly ${questionCount} interview questions for a candidate with the following profile:

Parsed Resume:
${JSON.stringify(parsedResume, null, 2)}

${atsAnalysis ? `ATS Analysis:\n${JSON.stringify(atsAnalysis, null, 2)}` : ''}
${jobDescription ? `Target Job Description:\n${jobDescription}` : ''}
${jobMatchScore ? `Job Match Score: ${jobMatchScore}` : ''}

Selected Interview Difficulty: ${difficulty}
Total Questions Required: ${questionCount}

Instructions:
1. Generate exactly ${questionCount} questions.
2. Distribute questions across these categories to create a balanced interview:
   - HR (e.g., career goals, values, behavior)
   - Technical (based on the technologies in the resume skills section)
   - Project-Based (tailored to the specific projects listed on their resume)
   - Coding (programming questions, ranging from basic algorithms to advanced patterns, matching the selected difficulty)
   - Behavioral (STAR method style - e.g., leadership, conflict, failure)
   - Scenario (simulated real-world errors/failures relevant to their stack, e.g., API crash, DB timeout)
3. For each question, provide a detailed sampleAnswer, 2-4 keyPoints, a helpful interview tip, and commonMistakes candidates make.
4. You MUST follow the JSON schema. Do not write any markdown or HTML.`;

  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              questions: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    category: { type: 'STRING' },
                    difficulty: { type: 'STRING' },
                    question: { type: 'STRING' },
                    sampleAnswer: { type: 'STRING' },
                    keyPoints: { type: 'ARRAY', items: { type: 'STRING' } },
                    tips: { type: 'STRING' },
                    commonMistakes: { type: 'STRING' },
                  },
                  required: ['category', 'difficulty', 'question', 'sampleAnswer', 'keyPoints', 'tips', 'commonMistakes'],
                },
              },
            },
            required: ['questions'],
          },
        },
      });

      const parsed = JSON.parse(response.text);
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid JSON structure returned by Gemini API');
      }

      return parsed.questions;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to generate interview questions:`, error.message);
      if (attempts >= 2) {
        throw error;
      }
    }
  }
};

/**
 * Evaluate candidate's answers against mock interview questions and sample answers.
 */
const evaluateInterviewAnswers = async (questions, userAnswers) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a professional hiring manager. Evaluate the user's answers to the following mock interview questions:

Questions and Sample Answers:
${JSON.stringify(questions, null, 2)}

User Answers:
${JSON.stringify(userAnswers, null, 2)}

Instructions:
1. Evaluate each answer. Give a score from 0 to 100 for each question.
2. Outline 1-3 specific strengths, 1-3 weaknesses, and actionable suggestions for improvement per question.
3. Calculate an overall average score for the interview.
4. Summarize the overall strengths, weaknesses, and recommended topics for the candidate's career progression.
5. You MUST follow the JSON schema. Do not write any markdown or HTML.`;

  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              score: { type: 'INTEGER' },
              overallFeedback: {
                type: 'OBJECT',
                properties: {
                  score: { type: 'INTEGER' },
                  strengths: { type: 'ARRAY', items: { type: 'STRING' } },
                  weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
                  recommendedTopics: { type: 'ARRAY', items: { type: 'STRING' } },
                },
                required: ['score', 'strengths', 'weaknesses', 'recommendedTopics'],
              },
              feedback: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    questionIndex: { type: 'INTEGER' },
                    score: { type: 'INTEGER' },
                    strengths: { type: 'ARRAY', items: { type: 'STRING' } },
                    weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
                    suggestions: { type: 'STRING' },
                  },
                  required: ['questionIndex', 'score', 'strengths', 'weaknesses', 'suggestions'],
                },
              },
            },
            required: ['score', 'overallFeedback', 'feedback'],
          },
        },
      });

      const parsed = JSON.parse(response.text);
      if (typeof parsed.score !== 'number' || !parsed.overallFeedback || !Array.isArray(parsed.feedback)) {
        throw new Error('Invalid JSON structure returned by Gemini API for evaluation');
      }

      return parsed;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to evaluate answers:`, error.message);
      if (attempts >= 2) {
        throw error;
      }
    }
  }
};

/**
 * Generate AI-powered comparison summary explaining improvements between two resume versions.
 */
const generateResumeComparison = async (resume1Data, resume2Data, diffData) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a professional resume writer and career coach.
Analyze the differences between two versions of a candidate's resume (Version 1 and Version 2) to summarize improvements and remaining weaknesses.

Version 1 Data:
\${JSON.stringify({
  title: resume1Data.resumeTitle,
  score: resume1Data.atsScore,
  summary: resume1Data.parsedData?.summary || '',
  skills: resume1Data.parsedData?.skills || [],
  experience: resume1Data.parsedData?.experience || [],
  projects: resume1Data.parsedData?.projects || [],
  education: resume1Data.parsedData?.education || [],
  certifications: resume1Data.parsedData?.certifications || [],
}, null, 2)}

Version 2 Data:
\${JSON.stringify({
  title: resume2Data.resumeTitle,
  score: resume2Data.atsScore,
  summary: resume2Data.parsedData?.summary || '',
  skills: resume2Data.parsedData?.skills || [],
  experience: resume2Data.parsedData?.experience || [],
  projects: resume2Data.parsedData?.projects || [],
  education: resume2Data.parsedData?.education || [],
  certifications: resume2Data.parsedData?.certifications || [],
}, null, 2)}

Statistical/Structural Diffs:
\${JSON.stringify(diffData, null, 2)}

Based on this information, provide:
1. An overall summary explaining the improvements made in Version 2 compared to Version 1.
2. Specific details on what got improved (e.g. better experience formatting, new skills, clearer summaries).
3. Remaining weaknesses in Version 2 that still need attention.
4. Action items (next steps) to make Version 2 even better.

You MUST follow the schema. Do not write any markdown or HTML.`;

  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              overallSummary: { type: 'STRING' },
              improvements: { type: 'ARRAY', items: { type: 'STRING' } },
              weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
              actionItems: { type: 'ARRAY', items: { type: 'STRING' } },
            },
            required: ['overallSummary', 'improvements', 'weaknesses', 'actionItems'],
          }
        }
      });

      const parsed = JSON.parse(response.text);
      if (!parsed.overallSummary || !Array.isArray(parsed.improvements) || !Array.isArray(parsed.weaknesses) || !Array.isArray(parsed.actionItems)) {
        throw new Error('Invalid JSON structure returned by Gemini API for resume comparison');
      }

      return parsed;
    } catch (error) {
      attempts++;
      console.error(`Attempt \${attempts} failed to generate resume comparison:`, error.message);
      if (attempts >= 2) {
        throw error;
      }
    }
  }
};

/**
 * Generate an AI cover letter.
 */
const generateCoverLetter = async ({
  parsedResume,
  atsAnalysis = null,
  jobMatch = null,
  company,
  position,
  hiringManager = '',
  tone,
  length,
  jobDescription = '',
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  const lengthGuides = {
    'Short': 'around 150-250 words, concise and direct',
    'Medium': 'around 250-400 words, balanced and comprehensive',
    'Long': 'around 400-600 words, highly detailed and narrative-driven',
  };

  const prompt = `You are a professional resume writer and career strategist. Write a cover letter for the candidate applying for:
Role: ${position}
Company: ${company}
${hiringManager ? `Hiring Manager: ${hiringManager}` : ''}
Tone: ${tone}
Target Length: ${lengthGuides[length] || length}

Use the candidate's parsed resume context:
- Summary: ${parsedResume?.summary || 'None'}
- Skills: ${Array.isArray(parsedResume?.skills) ? parsedResume.skills.join(', ') : 'None'}
- Experience: ${JSON.stringify(parsedResume?.experience || [])}
- Projects: ${JSON.stringify(parsedResume?.projects || [])}
- Education: ${JSON.stringify(parsedResume?.education || [])}

${atsAnalysis ? `ATS Context to weave in if helpful:
- Strengths: ${JSON.stringify(atsAnalysis.strengths || [])}
- Areas for Improvement: ${JSON.stringify(atsAnalysis.improvements || [])}` : ''}

${jobMatch ? `Job Matching context to optimize alignment:
- Match Score: ${jobMatch.overallMatch}%
- Missing Keywords: ${JSON.stringify(jobMatch.missingKeywords || [])}
- Matching Recommendations: ${JSON.stringify(jobMatch.recommendations || [])}` : ''}

${jobDescription ? `Target Job Description:
${jobDescription}` : ''}

CRITICAL RULES:
1. NEVER invent or fabricate any work experience, projects, skills, education, or credentials. Only use real information provided in the resume context.
2. Weave in the company and position naturally.
3. Highlight relevant skills and projects matching the job description/role.
4. Ensure a strong opening hook and professional call-to-action closing.
5. Do NOT include markdown tags around the returned letter. It will be displayed directly.
6. Provide a professional header format if appropriate (e.g. including Date, Hiring Manager/Company info). Use placeholder or clean lines for contact info (e.g., [Applicant Name], [Email], [Phone] or actual contact info if available in the resume. Note: If the resume contains applicant contact details like name, email, phone, use them. Otherwise, use placeholders like [Your Name], [Your Email], [Your Phone]).

You MUST follow the JSON schema. Return only the cover letter content.`;

  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              coverLetter: { type: 'STRING' }
            },
            required: ['coverLetter']
          }
        }
      });

      const parsed = JSON.parse(response.text);
      if (!parsed.coverLetter) {
        throw new Error('Invalid JSON structure returned by Gemini API');
      }

      return parsed.coverLetter;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to generate cover letter:`, error.message);
      if (attempts >= 2) {
        throw error;
      }
    }
  }
};

/**
 * Analyze a candidate's GitHub portfolio alongside their resume details and ATS/Job Match context.
 */
const analyzeGitHubPortfolio = async ({
  parsedResume,
  atsAnalysis = null,
  jobMatch = null,
  profile,
  statistics,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a professional technical recruiter and engineering manager.
Analyze the candidate's GitHub profile and repository statistics alongside their resume data to evaluate portfolio quality and consistency.

Resume / Candidate Context:
- Parsed Resume: ${JSON.stringify(parsedResume, null, 2)}
- ATS Analysis: ${JSON.stringify(atsAnalysis, null, 2)}
- Job Match Analysis: ${JSON.stringify(jobMatch, null, 2)}

GitHub Portfolio Context:
- Profile Info: ${JSON.stringify(profile, null, 2)}
- Repository Statistics: ${JSON.stringify(statistics, null, 2)}

Instructions:
1. Evaluate consistency between projects mentioned in the resume and those present on GitHub (e.g. projects listed on resume but missing on GitHub, and vice versa).
2. Look for missing skills/technologies mentioned in the resume that are not visible in GitHub repositories.
3. Assess repository quality, including availability of README files, documentation quality, project descriptions, and last active dates.
4. Calculate scores (0-100) for overall portfolio, GitHub content quality, and consistency with resume.
5. Provide actionable, specific improvements for both the resume and the GitHub profile.
6. You MUST follow the JSON schema exactly. Do not write any markdown, HTML, or extra text outside the JSON response.`;

  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              overallScore: { type: 'INTEGER' },
              githubScore: { type: 'INTEGER' },
              resumeConsistency: { type: 'INTEGER' },
              strengths: { type: 'ARRAY', items: { type: 'STRING' } },
              weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
              recommendations: { type: 'ARRAY', items: { type: 'STRING' } },
              missingProjects: { type: 'ARRAY', items: { type: 'STRING' } },
              missingSkills: { type: 'ARRAY', items: { type: 'STRING' } }
            },
            required: [
              'overallScore',
              'githubScore',
              'resumeConsistency',
              'strengths',
              'weaknesses',
              'recommendations',
              'missingProjects',
              'missingSkills'
            ]
          }
        }
      });

      const parsed = JSON.parse(response.text);
      
      if (
        typeof parsed.overallScore !== 'number' ||
        typeof parsed.githubScore !== 'number' ||
        typeof parsed.resumeConsistency !== 'number' ||
        !Array.isArray(parsed.strengths) ||
        !Array.isArray(parsed.weaknesses) ||
        !Array.isArray(parsed.recommendations) ||
        !Array.isArray(parsed.missingProjects) ||
        !Array.isArray(parsed.missingSkills)
      ) {
        throw new Error('Invalid JSON structure returned by Gemini API for GitHub Analysis');
      }

      return parsed;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to analyze GitHub portfolio:`, error.message);
      if (attempts >= 2) {
        throw error;
      }
    }
  }
};

module.exports = {
  generateSuggestions,
  generateJobMatchSuggestions,
  generateInterviewQuestions,
  evaluateInterviewAnswers,
  generateResumeComparison,
  generateCoverLetter,
  analyzeGitHubPortfolio,
};


