import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech roles',
    preview: 'bg-gradient-to-br from-primary/20 to-purple-100',
    icon: '📄',
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold and authoritative for senior positions',
    preview: 'bg-gradient-to-br from-slate-200 to-slate-300',
    icon: '💼',
    color: 'from-slate-600 to-slate-800',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique layout for designers and creatives',
    preview: 'bg-gradient-to-br from-pink-100 to-orange-100',
    icon: '🎨',
    color: 'from-pink-500 to-orange-500',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant for any industry',
    preview: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    icon: '✨',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Traditional format for research and education',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-100',
    icon: '🎓',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for engineering and IT roles',
    preview: 'bg-gradient-to-br from-indigo-100 to-blue-200',
    icon: '⚙️',
    color: 'from-indigo-500 to-blue-600',
  },
]

export default function TemplatesPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleUseTemplate = (templateId: string) => {
    // Save selected template to localStorage
    localStorage.setItem('smartats-selected-template', templateId)
    // Navigate to editor
    navigate('/editor/new')
  }

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
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name}</span>
              </div>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
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
              className="card hover:shadow-xl transition-all group cursor-pointer relative"
            >
              <div className={`w-full h-56 rounded-xl ${template.preview} mb-4 flex items-center justify-center overflow-hidden relative border border-slate-300 dark:border-slate-600`}>
                {/* Template-specific preview */}
                {template.id === 'modern' && (
                  <div className="w-full h-full p-5 flex flex-col">
                    <div className="w-3/4 h-5 bg-primary/70 rounded mb-1"></div>
                    <div className="w-1/2 h-3 bg-primary/50 rounded mb-4"></div>
                    <div className="h-px bg-primary/40 mb-3"></div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-slate-500/40 rounded"></div>
                      <div className="w-full h-2 bg-slate-500/40 rounded"></div>
                      <div className="w-4/5 h-2 bg-slate-500/40 rounded"></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <div className="px-2 py-1 bg-primary/50 rounded text-[8px]">React</div>
                      <div className="px-2 py-1 bg-primary/50 rounded text-[8px]">Node.js</div>
                      <div className="px-2 py-1 bg-primary/50 rounded text-[8px]">AWS</div>
                    </div>
                  </div>
                )}
                {template.id === 'executive' && (
                  <div className="w-full h-full p-5 flex gap-3">
                    <div className="w-16 h-16 bg-slate-600/50 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col">
                      <div className="w-full h-4 bg-slate-700/60 rounded mb-1"></div>
                      <div className="w-3/4 h-3 bg-slate-600/50 rounded mb-3"></div>
                      <div className="space-y-1.5">
                        <div className="w-full h-2 bg-slate-500/40 rounded"></div>
                        <div className="w-full h-2 bg-slate-500/40 rounded"></div>
                        <div className="w-5/6 h-2 bg-slate-500/40 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
                {template.id === 'creative' && (
                  <div className="w-full h-full flex">
                    <div className="w-2/5 bg-pink-200/60 p-4 flex flex-col gap-2">
                      <div className="w-full h-4 bg-pink-500/60 rounded"></div>
                      <div className="w-3/4 h-2 bg-pink-400/50 rounded"></div>
                      <div className="mt-3 space-y-1.5">
                        <div className="w-full h-2 bg-pink-400/40 rounded"></div>
                        <div className="w-full h-2 bg-pink-400/40 rounded"></div>
                        <div className="w-full h-2 bg-pink-400/40 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 space-y-2">
                      <div className="w-2/3 h-3 bg-orange-500/50 rounded"></div>
                      <div className="space-y-1.5 mt-3">
                        <div className="w-full h-2 bg-orange-400/40 rounded"></div>
                        <div className="w-full h-2 bg-orange-400/40 rounded"></div>
                        <div className="w-4/5 h-2 bg-orange-400/40 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
                {template.id === 'minimal' && (
                  <div className="w-full h-full p-6 flex flex-col items-center">
                    <div className="text-center mb-4">
                      <div className="w-32 h-4 bg-cyan-600/60 rounded mx-auto mb-2"></div>
                      <div className="w-24 h-2 bg-blue-500/50 rounded mx-auto"></div>
                    </div>
                    <div className="w-full space-y-2 mt-4">
                      <div className="w-full h-2 bg-slate-400/40 rounded"></div>
                      <div className="w-full h-2 bg-slate-400/40 rounded"></div>
                      <div className="w-3/4 h-2 bg-slate-400/40 rounded mx-auto"></div>
                    </div>
                    <div className="w-full mt-4 space-y-1.5">
                      <div className="w-2/3 h-2 bg-cyan-500/40 rounded"></div>
                      <div className="w-full h-1.5 bg-slate-300/40 rounded"></div>
                      <div className="w-full h-1.5 bg-slate-300/40 rounded"></div>
                    </div>
                  </div>
                )}
                {template.id === 'academic' && (
                  <div className="w-full h-full p-5 flex flex-col">
                    <div className="text-center pb-3 border-b-2 border-green-600/50 mb-3">
                      <div className="w-32 h-4 bg-green-700/70 rounded mx-auto mb-1"></div>
                      <div className="w-24 h-2 bg-emerald-600/50 rounded mx-auto"></div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="w-1/3 h-3 bg-green-600/60 rounded mb-1.5"></div>
                        <div className="w-full h-2 bg-slate-400/40 rounded mb-1"></div>
                        <div className="w-full h-2 bg-slate-400/40 rounded"></div>
                      </div>
                      <div>
                        <div className="w-1/3 h-3 bg-green-600/60 rounded mb-1.5"></div>
                        <div className="w-full h-2 bg-slate-400/40 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
                {template.id === 'technical' && (
                  <div className="w-full h-full p-5 flex flex-col">
                    <div className="flex items-start gap-2 mb-4">
                      <div className="w-1 h-10 bg-indigo-600/70 rounded"></div>
                      <div className="flex-1">
                        <div className="w-3/4 h-4 bg-indigo-700/70 rounded mb-1"></div>
                        <div className="w-1/2 h-2 bg-blue-600/50 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="w-full h-2 bg-slate-500/40 rounded"></div>
                      <div className="w-full h-2 bg-slate-500/40 rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="h-5 bg-indigo-500/50 rounded flex items-center justify-center">
                        <div className="w-3/4 h-1.5 bg-white/40 rounded"></div>
                      </div>
                      <div className="h-5 bg-indigo-500/50 rounded flex items-center justify-center">
                        <div className="w-3/4 h-1.5 bg-white/40 rounded"></div>
                      </div>
                      <div className="h-5 bg-indigo-500/50 rounded flex items-center justify-center">
                        <div className="w-3/4 h-1.5 bg-white/40 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Template icon badge */}
                <div className="absolute bottom-3 right-3 text-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg">
                  {template.icon}
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-1.5">{template.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 min-h-[32px]">
                {template.description}
              </p>
              
              <button 
                onClick={() => handleUseTemplate(template.id)}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
              >
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
