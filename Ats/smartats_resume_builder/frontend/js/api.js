const API_BASE = 'http://localhost:3000/api';

class API {
  constructor() {
    this.token = localStorage.getItem('token');
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes
    this.requestQueue = [];
    this.processing = false;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    this.clearCache();
  }

  clearCache() {
    this.cache.clear();
  }

  getCached(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async request(endpoint, options = {}) {
    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = this.getCached(endpoint);
      if (cached) return cached;
    }

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      // Cache GET requests
      if (!options.method || options.method === 'GET') {
        this.setCache(endpoint, data);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async register(email, password, name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data;
  }

  // Resumes
  async getResumes() {
    return this.request('/resumes');
  }

  async getResume(id) {
    return this.request(`/resumes/${id}`);
  }

  async createResume(title, template, content) {
    const data = await this.request('/resumes', {
      method: 'POST',
      body: JSON.stringify({ title, template, content })
    });
    this.clearCache(); // Invalidate cache
    return data;
  }

  async updateResume(id, data) {
    const result = await this.request(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    this.clearCache(); // Invalidate cache
    return result;
  }

  async deleteResume(id) {
    const result = await this.request(`/resumes/${id}`, {
      method: 'DELETE'
    });
    this.clearCache(); // Invalidate cache
    return result;
  }

  // AI
  async analyzeResume(resumeContent, jobDescription) {
    return this.request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ resumeContent, jobDescription })
    });
  }

  async getSuggestions(resumeId, jobDescription) {
    return this.request(`/ai/suggestions/${resumeId}`, {
      method: 'POST',
      body: JSON.stringify({ jobDescription })
    });
  }

  async optimizeContent(text, context) {
    return this.request('/ai/optimize', {
      method: 'POST',
      body: JSON.stringify({ text, context })
    });
  }
}

const api = new API();
