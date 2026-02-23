import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Sparkles, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech roles',
    preview: 'bg-gradient-to-br from-primary/20 to-purple-100',
    popular: true,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold and authoritative for senior positions',
    preview: 'bg-gradient-to-br from-slate-200 to-slate-300',
    popular: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique layout for designers and creatives',
    preview: 'bg-gradient-to-br from-pink-100 to-orange-100',
    popular: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant for any industry',
    preview: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    popular: false,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Traditional format for research and education',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-100',
    popular: false,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for engineering and IT roles',
    preview: 'bg-gradient-to-br from-indigo-100 to-blue-200',
    popular: true,
  },
]

export default function TemplatesPage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xl">S</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight">SmartATS</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2">Resume Templates</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Choose a professional template to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="card hover:shadow-xl transition-all group cursor-pointer"
            >
              {template.popular && (
                <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </div>
              )}
              
              <div className={`w-full h-48 rounded-xl ${template.preview} mb-4 flex items-center justify-center`}>
                <FileText className="w-16 h-16 text-slate-400" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{template.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {template.description}
              </p>
              
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
