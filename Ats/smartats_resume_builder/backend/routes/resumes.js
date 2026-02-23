const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all resumes for user
router.get('/', (req, res) => {
  try {
    const resumes = db.findResumesByUserId(req.user.userId);
    res.json(resumes.map(r => ({ ...r, content: JSON.parse(r.content) })));
  } catch (error) {
    console.error('Fetch resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Get single resume
router.get('/:id', (req, res) => {
  try {
    const resume = db.findResumeById(req.params.id, req.user.userId);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ ...resume, content: JSON.parse(resume.content) });
  } catch (error) {
    console.error('Fetch resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Create resume
router.post('/', (req, res) => {
  try {
    const { title, template, content } = req.body;
    const resumeId = uuidv4();

    const resume = {
      id: resumeId,
      user_id: req.user.userId,
      title,
      template: template || 'modern',
      content: JSON.stringify(content),
      ats_score: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.createResume(resume);

    res.status(201).json({ id: resumeId, message: 'Resume created successfully' });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// Update resume
router.put('/:id', (req, res) => {
  try {
    const { title, template, content, ats_score } = req.body;
    
    const updates = {
      title,
      template,
      content: JSON.stringify(content),
      ats_score: ats_score || 0
    };

    const result = db.updateResume(req.params.id, req.user.userId, updates);

    if (!result) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ message: 'Resume updated successfully' });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Delete resume
router.delete('/:id', (req, res) => {
  try {
    const result = db.deleteResume(req.params.id, req.user.userId);

    if (!result) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

module.exports = router;
