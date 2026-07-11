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

module.exports = {
  generateSuggestions,
  generateJobMatchSuggestions,
  generateInterviewQuestions,
  evaluateInterviewAnswers,
};


