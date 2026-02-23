import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000'

// API Client
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// AI Service Client
export const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiClient.post('/api/auth/register', data)
    return response.data
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/api/auth/login', data)
    return response.data
  },
  
  logout: async () => {
    const response = await apiClient.post('/api/auth/logout')
    return response.data
  },
}

// Resume API
export const resumeAPI = {
  getAll: async () => {
    const response = await apiClient.get('/api/resumes')
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/resumes/${id}`)
    return response.data
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/api/resumes', data)
    return response.data
  },
  
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/api/resumes/${id}`, data)
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/resumes/${id}`)
    return response.data
  },
}

// AI API
export const aiAPI = {
  analyze: async (data: { resume_text: string; job_description?: string; analysis_type?: string }) => {
    const response = await aiClient.post('/api/v1/analyze/', data)
    return response.data
  },
  
  optimize: async (data: { resume_text: string; target_role?: string; optimization_focus?: string[] }) => {
    const response = await aiClient.post('/api/v1/optimize/', data)
    return response.data
  },
  
  match: async (data: { resume_text: string; job_description: string }) => {
    const response = await aiClient.post('/api/v1/match/', data)
    return response.data
  },
  
  generate: async (data: { type: string; context: any }) => {
    const response = await aiClient.post('/api/v1/generate/', data)
    return response.data
  },
  
  score: async (data: { resume_text: string }) => {
    const response = await aiClient.post('/api/v1/score/', data)
    return response.data
  },
}
