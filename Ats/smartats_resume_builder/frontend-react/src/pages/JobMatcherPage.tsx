import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Briefcase, MapPin, DollarSign, Clock, Star } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const jobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$150k - $200k',
    type: 'Full-time',
    match: 92,
    posted: '2 days ago',
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$120k - $160k',
    type: 'Full-time',
    match: 88,
    posted: '1 week ago',
  },
  {
    id: '3',
    title: 'Frontend Engineer',
    company: 'DesignCo',
    location: 'New York, NY',
    salary: '$130k - $170k',
    type: 'Full-time',
    match: 85,
    posted: '3 days ago',
  },
]

export default function JobMatcherPage() {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

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
                  <span className="text-white font-black text-xl">S</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight">Job Matcher</span>
              </div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">{user?.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Find Your Perfect Match</h1>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered job recommendations based on your resume
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, company, or skills..."
              className="input pl-12 w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="card hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-semibold">{job.company}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">{job.match}% Match</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {job.posted}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="btn-primary flex-1">Apply Now</button>
                <button className="btn-secondary">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
