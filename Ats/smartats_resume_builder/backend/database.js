// Simple in-memory database for demo purposes
// In production, use a proper database like PostgreSQL or MongoDB

class SimpleDB {
  constructor() {
    this.users = [];
    this.resumes = [];
    this.jobDescriptions = [];
    this.aiSuggestions = [];
  }

  // User methods
  createUser(user) {
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  // Resume methods
  createResume(resume) {
    // Add analytics fields
    const resumeWithAnalytics = {
      ...resume,
      views: 0,
      downloads: 0,
      applications: 0,
      ats_score: 0
    };
    this.resumes.push(resumeWithAnalytics);
    return resumeWithAnalytics;
  }

  findResumesByUserId(userId) {
    return this.resumes.filter(r => r.user_id === userId);
  }

  findResumeById(id, userId) {
    return this.resumes.find(r => r.id === id && r.user_id === userId);
  }

  updateResume(id, userId, updates) {
    const index = this.resumes.findIndex(r => r.id === id && r.user_id === userId);
    if (index !== -1) {
      this.resumes[index] = { ...this.resumes[index], ...updates, updated_at: new Date().toISOString() };
      return this.resumes[index];
    }
    return null;
  }

  deleteResume(id, userId) {
    const index = this.resumes.findIndex(r => r.id === id && r.user_id === userId);
    if (index !== -1) {
      this.resumes.splice(index, 1);
      return true;
    }
    return false;
  }

  // Analytics methods
  incrementViews(id, userId) {
    const resume = this.findResumeById(id, userId);
    if (resume) {
      resume.views = (resume.views || 0) + 1;
      return resume;
    }
    return null;
  }

  incrementDownloads(id, userId) {
    const resume = this.findResumeById(id, userId);
    if (resume) {
      resume.downloads = (resume.downloads || 0) + 1;
      return resume;
    }
    return null;
  }

  incrementApplications(id, userId) {
    const resume = this.findResumeById(id, userId);
    if (resume) {
      resume.applications = (resume.applications || 0) + 1;
      return resume;
    }
    return null;
  }

  updateAtsScore(id, userId, score) {
    const resume = this.findResumeById(id, userId);
    if (resume) {
      resume.ats_score = score;
      return resume;
    }
    return null;
  }

  // AI Suggestions methods
  createSuggestion(suggestion) {
    this.aiSuggestions.push(suggestion);
    return suggestion;
  }

  findSuggestionsByResumeId(resumeId) {
    return this.aiSuggestions.filter(s => s.resume_id === resumeId);
  }
}

const db = new SimpleDB();

console.log('In-memory database initialized successfully');

module.exports = db;
