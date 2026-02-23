const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticateToken } = require('./auth');
const { analyzeResume, optimizeContent, generateSuggestions } = require('../ai/analyzer');

const router = express.Router();
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
