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

module.exports = {
  generateSuggestions,
};
