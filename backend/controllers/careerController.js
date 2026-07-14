const CareerChat = require('../models/CareerChat');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const JobMatch = require('../models/JobMatch');
const Comparison = require('../models/Comparison');
const { GoogleGenAI } = require('@google/genai');

/**
 * Get career coach prompt context
 */
const buildCareerCoachContext = async (userId, userName) => {
  let contextPrompt = `You are a professional, expert career coach and mentor. You are helping a user named ${userName}.
Below is the candidate's career and application context retrieved from their ResumeIQ AI profile:

`;

  // 1. Fetch latest parsed resume
  const resume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  if (resume && resume.parsedData) {
    contextPrompt += `=== RESUME PROFILE ===
Title: ${resume.resumeTitle}
Parsed Resume Details:
- Summary: ${resume.parsedData.summary || 'None'}
- Skills: ${(resume.parsedData.skills || []).join(', ') || 'None'}
- Experience: ${JSON.stringify(resume.parsedData.experience || [])}
- Projects: ${JSON.stringify(resume.parsedData.projects || [])}
- Certifications: ${(resume.parsedData.certifications || []).join(', ') || 'None'}
- Education: ${JSON.stringify(resume.parsedData.education || [])}
\n`;
  } else {
    contextPrompt += `=== RESUME PROFILE ===
User has not uploaded/parsed a resume yet. Warn the user gently and encourage them to upload their resume for highly personalized ATS and career matching analysis.\n\n`;
  }

  // 2. Fetch latest ATS analysis for this resume/user
  if (resume) {
    const analysis = await ResumeAnalysis.findOne({ userId, resumeId: resume._id }).sort({ createdAt: -1 });
    if (analysis) {
      contextPrompt += `=== ATS ANALYSIS ===
ATS Overall Score: ${analysis.overallScore}/100
ATS Score Breakdown: ${JSON.stringify(analysis.breakdown)}
Detected Strengths: ${(analysis.strengths || []).join(', ') || 'None'}
Detected Improvements Needed: ${(analysis.improvements || []).join(', ') || 'None'}
Critical Issues: ${(analysis.issues || []).join(', ') || 'None'}
Suggestions: ${analysis.suggestions ? JSON.stringify(analysis.suggestions) : 'None'}
\n`;
    }
  }

  // 3. Fetch latest job match results
  const jobMatches = await JobMatch.find({ userId }).sort({ createdAt: -1 }).limit(2);
  if (jobMatches && jobMatches.length > 0) {
    contextPrompt += `=== RECENT JOB MATCHING ANALYSIS ===\n`;
    jobMatches.forEach((match, idx) => {
      contextPrompt += `Match #${idx + 1}:
- Target Job Title: ${match.jobTitle}
- Overall Match Score: ${match.overallMatch}%
- Keyword Match: ${match.keywordMatch}%
- Skills Match: ${match.skillsMatch}%
- Missing Keywords: ${(match.missingKeywords || []).join(', ') || 'None'}
- Actionable Recommendations: ${(match.recommendations || []).join(', ') || 'None'}
\n`;
    });
  }

  // 4. Fetch latest resume comparisons
  const comparisons = await Comparison.find({ userId }).sort({ createdAt: -1 }).limit(2);
  if (comparisons && comparisons.length > 0) {
    contextPrompt += `=== RECENT RESUME COMPARISONS ===\n`;
    comparisons.forEach((comp, idx) => {
      contextPrompt += `Comparison #${idx + 1}:
- Score before: ${comp.score1}/100
- Score after: ${comp.score2}/100
- Summary of improvements: ${comp.comparisonData?.overallSummary || 'None'}
- Remaining weaknesses: ${(comp.comparisonData?.weaknesses || []).join(', ')}
- Suggested next actions: ${(comp.comparisonData?.actionItems || []).join(', ')}
\n`;
    });
  }

  contextPrompt += `=== GUIDELINES FOR THE COACH ===
- You must act as a professional, direct, encouraging, and detail-oriented career coach and resume strategist.
- Provide actionable, realistic, and tailored advice based on the user's actual profile details, ATS results, and job matches. Do not give generic advice (like "you should add projects") if they already have great projects list them by name.
- Highlight concrete technology/skill recommendations based on their missing keywords or industry trends.
- Format all your answers beautifully with standard markdown: use headings (e.g. ### Next Steps), bullet points, bolding, and inline code formatting for technologies. DO NOT use HTML tags.
- Encourage them to ask clarifying questions about interview preparation, roadmap building, certifications, or targeted projects.
- Keep your tone positive, empathetic, and professional.
`;

  return contextPrompt;
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const chat = await CareerChat.create({
      userId: req.user.id,
      title: 'New Career Coaching Session',
      messages: [],
    });
    res.status(201).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create conversation: ' + error.message,
    });
  }
};

// Send message to Gemini and update conversation
exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Message cannot be empty',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        status: 'error',
        message: 'Gemini API key is not configured',
      });
    }

    let chat;
    if (conversationId) {
      chat = await CareerChat.findOne({ _id: conversationId, userId: req.user.id });
      if (!chat) {
        return res.status(404).json({
          status: 'error',
          message: 'Conversation not found',
        });
      }
    } else {
      // Create new conversation on the fly
      chat = new CareerChat({
        userId: req.user.id,
        title: message.length > 30 ? message.substring(0, 30) + '...' : message,
        messages: [],
      });
    }

    // Build context
    const contextPrompt = await buildCareerCoachContext(req.user.id, req.user.name);

    // Call Gemini API
    const ai = new GoogleGenAI({ apiKey });

    // Format chat messages for Gemini
    const contents = chat.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: contextPrompt,
      },
    });

    const botResponseText = response.text || "I'm sorry, I couldn't generate a response. Please try again.";

    // Save user message and AI response
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    chat.messages.push({
      role: 'model',
      content: botResponseText,
      timestamp: new Date(),
    });

    // Update title dynamically if it was a default title and this is the first message
    if (chat.title === 'New Chat Session' || chat.title === 'New Career Coaching Session') {
      chat.title = message.length > 40 ? message.substring(0, 40) + '...' : message;
    }

    await chat.save();

    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    console.error('Career Coach API Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message: ' + error.message,
    });
  }
};

// Get conversation history list (excluding messages content for lightweight sidebar payload)
exports.getConversations = async (req, res) => {
  try {
    const chats = await CareerChat.find({ userId: req.user.id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      status: 'success',
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve conversation history: ' + error.message,
    });
  }
};

// Get single conversation details
exports.getConversationById = async (req, res) => {
  try {
    const chat = await CareerChat.findOne({ _id: req.params.id, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve conversation: ' + error.message,
    });
  }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
  try {
    const chat = await CareerChat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete conversation: ' + error.message,
    });
  }
};

// Rename a conversation
exports.renameConversation = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Title cannot be empty',
      });
    }

    const chat = await CareerChat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title: title.trim() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to rename conversation: ' + error.message,
    });
  }
};
