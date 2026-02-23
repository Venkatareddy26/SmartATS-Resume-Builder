import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Save, Download, User, FileText, Briefcase, GraduationCap, 
  Wrench, Award, Lightbulb, TrendingUp, BarChart3, Sparkles,
  ChevronDown, CheckCircle, Plus, Trash2, ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import { resumeAPI } from '../lib/api'

interface ContactInfo {
  name: string
  email: string
  phone: string
  location: string
  website: string
}

interface Experience {
  id: string
  title: string
  company: string
  startDate: string
  endDate: string
  description: string[]
}

interface Education {
  id: string
  degree: string
  school: string
  year: string
}

interface ResumeData {
  contact: ContactInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  certifications: string[]
}

export default function EditorPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [activeSection, setActiveSection] = useState('experience')
  const [isSaving, setIsSaving] = useState(false)

  // Scroll to section when navigation is clicked
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const [resumeData, setResumeData] = useState<ResumeData>({
    contact: {
      name: 'Jordan Smith',
      email: 'jordan.smith@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      website: 'github.com/jsmith-dev',
    },
    summary: 'Innovative Software Engineer with 5+ years of experience in building scalable web applications and microservices. Expertise in cloud-native technologies, distributed systems, and modern JavaScript frameworks.',
    experience: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechNova Solutions',
        startDate: '2021',
        endDate: 'Present',
        description: [
          'Architected and led the migration of a legacy monolithic application to a microservices architecture using Node.js and Docker.',
          'Improved system throughput by 40% through implementing an event-driven data pipeline with Apache Kafka.',
          'Mentored a team of 5 junior developers, fostering best practices in CI/CD and unit testing.',
        ],
      },
    ],
    education: [
      {
        id: '1',
        degree: 'B.S. Computer Science',
        school: 'Stanford University',
        year: '2018',
      },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional'],
  })

  // Fetch resume data (optional - using local state for now)
  const { isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => id ? resumeAPI.getById(id) : null,
    enabled: !!id,
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => resumeAPI.update(id!, { content: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', id] })
      setIsSaving(false)
      toast.success('Changes saved')
    },
  })

  const handleSave = () => {
    setIsSaving(true)
    updateMutation.mutate(resumeData)
  }

  const handleDownload = () => {
    // Create a printable version of the resume
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Please allow popups to download')
      return
    }

    const resumeHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resumeData.contact.name} - Resume</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #1e293b; }
          h1 { font-size: 32px; text-transform: uppercase; margin-bottom: 10px; border-bottom: 3px solid #5048e5; padding-bottom: 10px; }
          .contact { display: flex; gap: 20px; margin-bottom: 30px; font-size: 14px; color: #64748b; }
          h2 { color: #5048e5; font-size: 18px; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
          .job { margin-bottom: 20px; }
          .job-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .job-title { font-weight: bold; }
          .job-date { color: #64748b; font-size: 14px; }
          ul { margin: 10px 0; padding-left: 20px; }
          li { margin-bottom: 5px; line-height: 1.6; }
          .skills { display: flex; flex-wrap: wrap; gap: 10px; }
          .skill { background: #f1f5f9; padding: 5px 15px; border-radius: 20px; font-size: 14px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>${resumeData.contact.name}</h1>
        <div class="contact">
          <span>${resumeData.contact.email}</span>
          <span>${resumeData.contact.phone}</span>
          <span>${resumeData.contact.location}</span>
          <span>${resumeData.contact.website}</span>
        </div>

        <h2>Professional Summary</h2>
        <p>${resumeData.summary}</p>

        <h2>Experience</h2>
        ${resumeData.experience.map(exp => `
          <div class="job">
            <div class="job-header">
              <span class="job-title">${exp.title} | ${exp.company}</span>
              <span class="job-date">${exp.startDate} — ${exp.endDate}</span>
            </div>
            <ul>
              ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        <h2>Education</h2>
        ${resumeData.education.map(edu => `
          <div class="job">
            <div class="job-header">
              <span class="job-title">${edu.degree} | ${edu.school}</span>
              <span class="job-date">${edu.year}</span>
            </div>
          </div>
        `).join('')}

        <h2>Skills</h2>
        <div class="skills">
          ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>

        ${resumeData.certifications.length > 0 ? `
          <h2>Certifications</h2>
          <ul>
            ${resumeData.certifications.map(cert => `<li>${cert}</li>`).join('')}
          </ul>
        ` : ''}
      </body>
      </html>
    `

    printWindow.document.write(resumeHTML)
    printWindow.document.close()
    
    // Auto-trigger print dialog
    setTimeout(() => {
      printWindow.print()
      toast.success('Resume ready to download!')
    }, 250)
  }

  const updateContact = (field: keyof ContactInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }))
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: 'New Position',
      company: 'Company Name',
      startDate: '2024',
      endDate: 'Present',
      description: ['Add your achievements here'],
    }
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const deleteExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: 'Degree Name',
      school: 'School Name',
      year: '2024',
    }
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const deleteEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }))
  }

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, 'New Skill'],
    }))
  }

  const deleteSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, 'New Certification'],
    }))
  }

  const deleteCertification = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background-light dark:bg-background-dark">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">SmartATS</h2>
          <div className="ml-6 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {isSaving ? 'Saving...' : 'All changes saved'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-slate-700 shadow-sm">
              Modern
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
              Executive
            </button>
            <button className="px-2 py-1.5">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-sm shadow-primary/20"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Section Navigation */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-4 gap-2 overflow-y-auto">
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">
              Resume Sections
            </p>
          </div>

          {[
            { id: 'contact', icon: User, label: 'Contact Info' },
            { id: 'summary', icon: FileText, label: 'Summary' },
            { id: 'experience', icon: Briefcase, label: 'Experience' },
            { id: 'education', icon: GraduationCap, label: 'Education' },
            { id: 'skills', icon: Wrench, label: 'Skills' },
            { id: 'certifications', icon: Award, label: 'Certifications' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors ${
                activeSection === section.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className={`text-sm ${activeSection === section.id ? 'font-bold' : 'font-medium'}`}>
                {section.label}
              </span>
            </button>
          ))}

          <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Completion
              </span>
              <span className="text-xs font-bold text-primary">85%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Great progress! Keep going.
            </p>
          </div>
        </aside>

        {/* Center: Live Preview Canvas */}
        <section className="flex-1 bg-background-light dark:bg-background-dark overflow-y-auto p-12 flex justify-center">
          <div className="w-full max-w-[800px] bg-white dark:bg-slate-800 min-h-[1050px] shadow-2xl rounded-sm flex flex-col p-12">
            {/* Resume Header */}
            <div id="section-contact" className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 mb-8">
              <input
                type="text"
                value={resumeData.contact.name}
                onChange={(e) => updateContact('name', e.target.value)}
                className="text-4xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 mb-2 w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
              />
              <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                <input
                  type="email"
                  value={resumeData.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
                />
                <input
                  type="tel"
                  value={resumeData.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
                />
                <input
                  type="text"
                  value={resumeData.contact.location}
                  onChange={(e) => updateContact('location', e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
                />
                <input
                  type="text"
                  value={resumeData.contact.website}
                  onChange={(e) => updateContact('website', e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
                />
              </div>
            </div>

            {/* Resume Content */}
            <div className="flex flex-col gap-8">
              {/* Professional Summary */}
              <section id="section-summary">
                <h3 className="text-lg font-bold uppercase text-primary mb-3 border-b border-slate-100 dark:border-slate-700 pb-1">
                  Professional Summary
                </h3>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full text-slate-700 dark:text-slate-300 leading-relaxed text-sm bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1 min-h-[80px]"
                />
              </section>

              {/* Experience */}
              <section id="section-experience">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1 flex-1">
                    Experience
                  </h3>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-col gap-6">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="relative group">
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <div className="flex justify-between items-baseline mb-1">
                        <input
                          type="text"
                          value={`${exp.title} | ${exp.company}`}
                          onChange={(e) => {
                            const [title, company] = e.target.value.split('|').map(s => s.trim())
                            setResumeData(prev => ({
                              ...prev,
                              experience: prev.experience.map(e =>
                                e.id === exp.id ? { ...e, title, company } : e
                              ),
                            }))
                          }}
                          className="font-bold text-slate-900 dark:text-slate-100 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 flex-1"
                        />
                        <input
                          type="text"
                          value={`${exp.startDate} — ${exp.endDate}`}
                          onChange={(e) => {
                            const [start, end] = e.target.value.split('—').map(s => s.trim())
                            setResumeData(prev => ({
                              ...prev,
                              experience: prev.experience.map(e =>
                                e.id === exp.id ? { ...e, startDate: start, endDate: end } : e
                              ),
                            }))
                          }}
                          className="text-sm font-semibold text-slate-500 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
                        />
                      </div>
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-700 dark:text-slate-300 flex flex-col gap-1.5">
                        {exp.description.map((desc, idx) => (
                          <li key={idx}>
                            <input
                              type="text"
                              value={desc}
                              onChange={(e) => {
                                const newValue = e.target.value
                                setResumeData(prev => ({
                                  ...prev,
                                  experience: prev.experience.map(experience =>
                                    experience.id === exp.id
                                      ? { ...experience, description: experience.description.map((d, i) => i === idx ? newValue : d) }
                                      : experience
                                  ),
                                }))
                              }}
                              className="w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section id="section-education">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1 flex-1">
                    Education
                  </h3>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="relative group flex justify-between items-baseline">
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <input
                        type="text"
                        value={`${edu.degree} | ${edu.school}`}
                        onChange={(e) => {
                          const [degree, school] = e.target.value.split('|').map(s => s.trim())
                          setResumeData(prev => ({
                            ...prev,
                            education: prev.education.map(e =>
                              e.id === edu.id ? { ...e, degree, school } : e
                            ),
                          }))
                        }}
                        className="font-bold text-slate-900 dark:text-slate-100 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 flex-1"
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => {
                          const newYear = e.target.value
                          setResumeData(prev => ({
                            ...prev,
                            education: prev.education.map(education =>
                              education.id === edu.id ? { ...education, year: newYear } : education
                            ),
                          }))
                        }}
                        className="text-sm font-semibold text-slate-500 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section id="section-skills">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1 flex-1">
                    Skills
                  </h3>
                  <button
                    onClick={addSkill}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, idx) => (
                    <div key={idx} className="group relative">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          setResumeData(prev => ({
                            ...prev,
                            skills: prev.skills.map((s, i) => i === idx ? e.target.value : s),
                          }))
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 border-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        onClick={() => deleteSkill(idx)}
                        className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Certifications */}
              <section id="section-certifications">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1 flex-1">
                    Certifications
                  </h3>
                  <button
                    onClick={addCertification}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <ul className="list-disc list-outside ml-4 text-sm text-slate-700 dark:text-slate-300 flex flex-col gap-2">
                  {resumeData.certifications.map((cert, idx) => (
                    <li key={idx} className="group relative">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => {
                          setResumeData(prev => ({
                            ...prev,
                            certifications: prev.certifications.map((c, i) => i === idx ? e.target.value : c),
                          }))
                        }}
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2"
                      />
                      <button
                        onClick={() => deleteCertification(idx)}
                        className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </section>

        {/* Right Sidebar: AI Optimization Panel */}
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">AI Optimization</h3>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>

            {/* Match Score Gauge */}
            <div className="flex flex-col items-center mb-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="relative flex items-center justify-center mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    className="text-slate-200 dark:text-slate-700"
                    cx="48"
                    cy="48"
                    fill="transparent"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                  ></circle>
                  <circle
                    className="text-primary"
                    cx="48"
                    cy="48"
                    fill="transparent"
                    r="42"
                    stroke="currentColor"
                    strokeDasharray="264"
                    strokeDashoffset="39.6"
                    strokeWidth="8"
                  ></circle>
                </svg>
                <span className="absolute text-2xl font-black text-slate-900 dark:text-white">
                  85%
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                ATS Match Score
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Target: <span className="font-bold">Software Engineer</span>
              </p>
            </div>

            {/* Optimization Tips */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                Top Suggestions
              </h4>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                      Missing Keyword
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-300/80 leading-relaxed">
                      The job description mentions <span className="font-bold">"Kubernetes"</span> 4
                      times. Add it to your skills or experience section.
                    </p>
                    <button className="mt-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight flex items-center gap-1">
                      Add now →
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Quantify Impact
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Try to add more metrics to your experience. Use percentages or dollar amounts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Action Verbs
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      You used "Developed" multiple times. Try "Engineered" or "Spearheaded".
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Keyword: Scalability
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Include "Scalability" to match high-priority keywords in the description.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
            <button className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Full AI Audit
            </button>
          </div>
        </aside>
      </main>
    </div>
  )
}
