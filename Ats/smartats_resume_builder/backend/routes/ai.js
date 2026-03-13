const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticateToken } = require('./auth');
const { analyzeResume, optimizeContent, generateSuggestions } = require('../ai/analyzer');

const router = express.Router();

// Chat with AI Assistant (Cohere API with smart fallback)
router.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  console.log('Received chat request with', messages.length, 'messages');

  // Get the last user message
  const lastUserMessage = messages[messages.length - 1]?.content || '';
  
  // Build conversation history for Cohere
  const conversationHistory = messages.slice(-5, -1).map(msg => ({
    role: msg.role === 'user' ? 'USER' : 'CHATBOT',
    message: msg.content
  }));

  console.log('Calling Cohere API...');

  // Try Cohere API with your API key
  const cohereApiKey = process.env.COHERE_API_KEY || 'qtIWFupFI8n4De9fhra8KEWJxBZkfUGIQWKfA1Px';
  
  try {
    const cohereResponse = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cohereApiKey}`
      },
      body: JSON.stringify({
        message: lastUserMessage,
        model: 'command-r',
        preamble: 'You are a professional resume and career advisor. Help users improve their resumes, optimize for ATS systems, and provide career guidance. Be concise, actionable, and encouraging. Format responses with bullet points when listing multiple items.',
        chat_history: conversationHistory,
        temperature: 0.7
      })
    });

    if (cohereResponse.ok) {
      const cohereData = await cohereResponse.json();
      if (cohereData.text) {
        console.log('Cohere response received');
        return res.json({ message: cohereData.text });
      }
    } else {
      const errorData = await cohereResponse.json();
      console.error('Cohere API error:', errorData);
    }
  } catch (cohereError) {
    console.error('Cohere failed:', cohereError.message);
  }

  // Fallback to smart keyword-based responses
  console.log('Using smart fallback response');
  const fallbackMessage = getSmartFallbackResponse(lastUserMessage);
  res.json({ message: fallbackMessage });
});

// Smart fallback responses based on keywords
function getSmartFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('summary') || msg.includes('objective')) {
    return `Here are tips for a strong resume summary:\n\n• Start with your professional title and years of experience\n• Highlight 2-3 key achievements with metrics\n• Include relevant skills that match the job\n• Keep it to 3-4 sentences\n• Use action words like "led," "increased," "developed"\n\nExample: "Senior Software Engineer with 5+ years building scalable web applications. Increased system performance by 40% and led a team of 4 developers. Expert in React, Node.js, and cloud architecture."`;
  }
  
  if (msg.includes('ats') || msg.includes('applicant tracking')) {
    return `To optimize for ATS systems:\n\n• Use standard section headings (Experience, Education, Skills)\n• Include keywords from the job description\n• Avoid tables, images, and complex formatting\n• Use common fonts (Arial, Calibri, Times New Roman)\n• Save as .docx or PDF\n• Spell out acronyms at least once\n• Use bullet points for easy scanning\n\nATS systems scan for keyword matches, so tailor your resume to each job posting!`;
  }
  
  if (msg.includes('keyword') || msg.includes('skills')) {
    return `For keyword optimization:\n\n• Mirror language from the job description\n• Include both hard skills (technical) and soft skills (communication)\n• Use industry-specific terms and tools\n• Add certifications and technologies\n• Quantify your experience (e.g., "5+ years of Python")\n\nExample skills section:\nTechnical: JavaScript, React, Node.js, AWS, Docker, PostgreSQL\nSoft Skills: Team Leadership, Agile Methodology, Problem Solving`;
  }
  
  if (msg.includes('experience') || msg.includes('work history')) {
    return `For strong experience bullets:\n\n• Start with action verbs (Led, Developed, Increased, Managed)\n• Include specific metrics and results\n• Focus on achievements, not just duties\n• Use the STAR method (Situation, Task, Action, Result)\n• Tailor to the job you're applying for\n\nExample:\n❌ "Responsible for managing projects"\n✅ "Led 5 cross-functional projects, delivering $2M in cost savings and improving efficiency by 30%"`;
  }
  
  return `I'm here to help with your resume! I can assist with:\n\n• Writing compelling summaries and objectives\n• Optimizing for ATS (Applicant Tracking Systems)\n• Improving bullet points with action verbs and metrics\n• Selecting the right keywords for your industry\n• Formatting and structure advice\n• Tailoring your resume to specific jobs\n\nWhat specific aspect of your resume would you like help with?`;
}

// All other routes require authentication
router.use(authenticateToken);

// Analyze resume against job description
router.post('/analyze', async (req, res) => {
  try {
    const { resumeContent, jobDescription } = req.body;

    if (!resumeContent || !jobDescription) {
      return res.status(400).json({ error: 'Resume content and job description required' });
    }

    const analysis = await analyzeResume(resumeContent, jobDescription);
    res.json(analysis);
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ error: 'AI analysis failed', details: error.message });
  }
});

// Get AI suggestions for resume
router.post('/suggestions/:resumeId', async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resume = db.findResumeById(req.params.resumeId, req.user.userId);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const suggestions = await generateSuggestions(JSON.parse(resume.content), jobDescription);

    // Save suggestions to database
    suggestions.forEach(s => {
      const suggestion = {
        id: uuidv4(),
        resume_id: req.params.resumeId,
        section: s.section,
        suggestion_type: s.type,
        original_text: s.original || null,
        suggested_text: s.suggested,
        reason: s.reason,
        applied: false,
        created_at: new Date().toISOString()
      };
      db.createSuggestion(suggestion);
    });

    res.json(suggestions);
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Optimize specific content
router.post('/optimize', async (req, res) => {
  try {
    const { text, context } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const optimized = await optimizeContent(text, context);
    res.json({ optimized });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Content optimization failed' });
  }
});

// Get saved suggestions
router.get('/suggestions/:resumeId', (req, res) => {
  try {
    const suggestions = db.findSuggestionsByResumeId(req.params.resumeId);
    res.json(suggestions);
  } catch (error) {
    console.error('Fetch suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;
