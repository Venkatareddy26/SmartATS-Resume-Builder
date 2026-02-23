import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Eye, Download, Users, BarChart3, Activity } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function AnalyticsPage() {
  const { user } = useAuthStore()

  const stats = [
    { label: 'Total Views', value: '1,234', icon: Eye, change: '+12%', color: 'text-blue-500' },
    { label: 'Downloads', value: '456', icon: Download, change: '+8%', color: 'text-green-500' },
    { label: 'Applications', value: '89', icon: Users, change: '+23%', color: 'text-purple-500' },
    { label: 'Avg ATS Score', value: '85%', icon: BarChart3, change: '+5%', color: 'text-primary' },
  ]

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">Analytics</span>
              </div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">{user?.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2">Resume Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your resume performance and engagement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Views Over Time</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-slate-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-6">Top Performing Resumes</h3>
            <div className="space-y-4">
              {[
                { name: 'Software Engineer Resume', views: 456, score: 92 },
                { name: 'Product Manager Resume', views: 389, score: 88 },
                { name: 'Data Scientist Resume', views: 234, score: 85 },
              ].map((resume, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="font-bold text-sm">{resume.name}</p>
                    <p className="text-xs text-slate-500">{resume.views} views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{resume.score}%</p>
                    <p className="text-xs text-slate-500">ATS Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
