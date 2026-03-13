import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, FileText, Trash2, Edit, TrendingUp, Clock, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { resumeAPI } from '../lib/api'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, logout } = useAuthStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch resumes
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeAPI.getAll,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: resumeAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Resume deleted successfully')
      setDeletingId(null)
    },
    onError: () => {
      toast.error('Failed to delete resume')
      setDeletingId(null)
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      setDeletingId(id)
      deleteMutation.mutate(id)
    }
  }

  const handleCreateNew = async () => {
    try {
      const newResume = await resumeAPI.create({
        title: 'Untitled Resume',
        content: {
          contact: { name: user?.name || '', email: user?.email || '' },
          summary: '',
          experience: [],
          education: [],
          skills: [],
          certifications: [],
        },
      })
      navigate(`/editor/${newResume.id}`)
    } catch (error) {
      toast.error('Failed to create resume')
    }
  }

  const stats = {
    total: resumes.length,
    avgScore: resumes.length > 0
      ? Math.round(resumes.reduce((acc: number, r: any) => acc + (r.ats_score || 0), 0) / resumes.length)
      : 0,
    lastUpdated: resumes.length > 0
      ? new Date(Math.max(...resumes.map((r: any) => new Date(r.updated_at).getTime()))).toLocaleDateString()
      : 'N/A',
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xl">S</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight">SmartATS</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-semibold text-primary">
                Dashboard
              </Link>
              <Link to="/templates" className="text-sm font-medium hover:text-primary">
                Templates
              </Link>
              <Link to="/ai-assistant" className="text-sm font-medium hover:text-primary">
                AI Assistant
              </Link>
              <Link to="/job-matcher" className="text-sm font-medium hover:text-primary">
                Job Matcher
              </Link>
              <Link to="/analytics" className="text-sm font-medium hover:text-primary">
                Analytics
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {user?.name}
              </span>
              <button onClick={logout} className="text-sm font-medium hover:text-primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your resumes and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Total Resumes
            </p>
            <p className="text-3xl font-black">{stats.total}</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Avg ATS Score
            </p>
            <p className="text-3xl font-black">{stats.avgScore}%</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Last Updated
            </p>
            <p className="text-xl font-black">{stats.lastUpdated}</p>
          </div>
        </div>

        {/* Create New Button */}
        <div className="mb-8">
          <button onClick={handleCreateNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Resume
          </button>
        </div>

        {/* Resumes List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No resumes yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first resume to get started
            </p>
            <button onClick={handleCreateNew} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume: any) => (
              <div
                key={resume.id}
                className="card hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Updated {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  {resume.ats_score && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg">
                      <Star className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-primary">
                        {resume.ats_score}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/editor/${resume.id}`}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    className="btn-secondary px-3 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
