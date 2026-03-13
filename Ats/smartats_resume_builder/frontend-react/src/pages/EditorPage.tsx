import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Save, Download, User, FileText, Briefcase, GraduationCap, 
  Wrench, Award, Lightbulb, TrendingUp, BarChart3, Sparkles,
  ChevronDown, CheckCircle, Plus, Trash2, ArrowLeft, X,
  AlertTriangle, Target, Zap, BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { resumeAPI } from '../lib/api'
import jsPDF from 'jspdf'

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

// ATS Score computation
function computeATSScore(data: ResumeData): number {
  let score = 0
  const maxScore = 100

  // Contact completeness (15 pts)
  const contactFields = [data.contact.name, data.contact.email, data.contact.phone, data.contact.location, data.contact.website]
  const filledContacts = contactFields.filter(f => f && f.trim().length > 0).length
  score += (filledContacts / 5) * 15

  // Summary quality (20 pts)
  if (data.summary.length > 0) score += 5
  if (data.summary.length > 50) score += 5
  if (data.summary.length > 100) score += 5
  if (/\d+/.test(data.summary)) score += 5 // contains metrics

  // Experience quality (25 pts)
  if (data.experience.length > 0) score += 5
  if (data.experience.length >= 2) score += 5
  const totalBullets = data.experience.reduce((sum, exp) => sum + exp.description.length, 0)
  if (totalBullets >= 3) score += 5
  const hasMetrics = data.experience.some(exp => exp.description.some(d => /\d+%?/.test(d)))
  if (hasMetrics) score += 5
  const actionVerbs = ['led', 'built', 'designed', 'architected', 'improved', 'developed', 'managed', 'created', 'implemented', 'delivered', 'engineered', 'spearheaded', 'mentored', 'optimized']
  const hasActionVerbs = data.experience.some(exp => exp.description.some(d => actionVerbs.some(v => d.toLowerCase().includes(v))))
  if (hasActionVerbs) score += 5

  // Education (10 pts)
  if (data.education.length > 0) score += 10

  // Skills (20 pts)
  if (data.skills.length > 0) score += 5
  if (data.skills.length >= 4) score += 5
  if (data.skills.length >= 8) score += 5
  if (data.skills.length >= 10) score += 5

  // Certifications (10 pts)
  if (data.certifications.length > 0) score += 5
  if (data.certifications.length >= 2) score += 5

  return Math.min(Math.round(score), maxScore)
}

// AI Audit analysis
interface AuditResult {
  overallScore: number
  sections: { name: string; score: number; feedback: string; icon: string }[]
  keywords: { found: string[]; missing: string[] }
  actionItems: string[]
}

function performAIAudit(data: ResumeData): AuditResult {
  const sections: AuditResult['sections'] = []
  const actionItems: string[] = []

  // Contact
  const contactFields = [data.contact.name, data.contact.email, data.contact.phone, data.contact.location, data.contact.website]
  const filledContacts = contactFields.filter(f => f && f.trim().length > 0).length
  const contactScore = Math.round((filledContacts / 5) * 100)
  sections.push({ name: 'Contact Info', score: contactScore, feedback: filledContacts === 5 ? 'All contact fields complete.' : `Missing ${5 - filledContacts} field(s). Complete all contact info for better reach.`, icon: 'contact' })
  if (filledContacts < 5) actionItems.push('Fill in all contact information fields.')

  // Summary
  let summaryScore = 0
  if (data.summary.length > 100) summaryScore = 90
  else if (data.summary.length > 50) summaryScore = 60
  else if (data.summary.length > 0) summaryScore = 30
  if (/\d+/.test(data.summary)) summaryScore = Math.min(summaryScore + 10, 100)
  sections.push({ name: 'Professional Summary', score: summaryScore, feedback: summaryScore >= 80 ? 'Strong summary with good detail.' : 'Add more detail and quantifiable achievements to your summary.', icon: 'summary' })
  if (summaryScore < 80) actionItems.push('Expand your professional summary with specific metrics and achievements.')

  // Experience
  let expScore = 0
  if (data.experience.length > 0) expScore += 30
  if (data.experience.length >= 2) expScore += 20
  const bullets = data.experience.reduce((s, e) => s + e.description.length, 0)
  if (bullets >= 5) expScore += 25
  else if (bullets >= 3) expScore += 15
  const metricsFound = data.experience.some(e => e.description.some(d => /\d+%?/.test(d)))
  if (metricsFound) expScore += 25
  sections.push({ name: 'Experience', score: Math.min(expScore, 100), feedback: expScore >= 80 ? 'Well-detailed experience with metrics.' : 'Add more quantifiable achievements and action verbs.', icon: 'experience' })
  if (!metricsFound) actionItems.push('Add quantifiable metrics (percentages, dollar amounts) to experience bullets.')

  // Skills
  let skillScore = data.skills.length >= 10 ? 100 : data.skills.length >= 6 ? 75 : data.skills.length >= 3 ? 50 : data.skills.length > 0 ? 25 : 0
  sections.push({ name: 'Skills', score: skillScore, feedback: skillScore >= 75 ? 'Good variety of skills listed.' : 'Add more relevant technical and soft skills.', icon: 'skills' })
  if (skillScore < 75) actionItems.push('Add more relevant skills to improve keyword matching.')

  // Keywords analysis
  const techKeywords = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Agile', 'REST', 'GraphQL', 'SQL', 'MongoDB', 'Git']
  const resumeText = JSON.stringify(data).toLowerCase()
  const found = techKeywords.filter(k => resumeText.includes(k.toLowerCase()))
  const missing = techKeywords.filter(k => !resumeText.includes(k.toLowerCase()))

  const overallScore = Math.round(sections.reduce((s, sec) => s + sec.score, 0) / sections.length)

  if (data.certifications.length === 0) actionItems.push('Add professional certifications to stand out.')

  return { overallScore, sections, keywords: { found, missing: missing.slice(0, 5) }, actionItems }
}

export default function EditorPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [activeSection, setActiveSection] = useState('experience')
  const [isSaving, setIsSaving] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')

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

  // Load saved draft from localStorage on mount
  useEffect(() => {
    // Check if a template was selected
    const templateFromStorage = localStorage.getItem('smartats-selected-template')
    
    const savedDraft = localStorage.getItem(`smartats-draft-${id || 'new'}`)
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setResumeData(parsed)
        // Load saved template if exists
        const savedTemplate = localStorage.getItem(`smartats-template-${id || 'new'}`)
        if (savedTemplate) {
          setSelectedTemplate(savedTemplate)
        }
      } catch (e) { /* ignore corrupt data */ }
    } else if (templateFromStorage && id === 'new') {
      // Apply template-specific default data
      const templateData = getTemplateData(templateFromStorage)
      setResumeData(templateData)
      setSelectedTemplate(templateFromStorage)
      // Save template selection
      localStorage.setItem(`smartats-template-${id || 'new'}`, templateFromStorage)
      // Clear the selected template
      localStorage.removeItem('smartats-selected-template')
    }
  }, [id])

  // Get template-specific data
  const getTemplateData = (templateId: string): ResumeData => {
    const baseData = {
      contact: {
        name: 'Your Name',
        email: 'your.email@example.com',
        phone: '(555) 123-4567',
        location: 'City, State',
        website: 'linkedin.com/in/yourname',
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      certifications: [],
    }

    switch (templateId) {
      case 'modern':
        return {
          ...baseData,
          summary: 'Innovative professional with expertise in modern technologies and best practices.',
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS'],
        }
      case 'executive':
        return {
          ...baseData,
          summary: 'Strategic leader with proven track record of driving organizational growth and innovation.',
          skills: ['Leadership', 'Strategy', 'Business Development', 'Team Management'],
        }
      case 'creative':
        return {
          ...baseData,
          summary: 'Creative professional passionate about design, innovation, and user experience.',
          skills: ['UI/UX Design', 'Adobe Creative Suite', 'Figma', 'Branding', 'Typography'],
        }
      case 'minimal':
        return {
          ...baseData,
          summary: 'Results-driven professional focused on delivering excellence.',
          skills: ['Communication', 'Problem Solving', 'Project Management'],
        }
      case 'academic':
        return {
          ...baseData,
          summary: 'Dedicated researcher and educator committed to advancing knowledge in the field.',
          skills: ['Research', 'Data Analysis', 'Academic Writing', 'Teaching'],
        }
      case 'technical':
        return {
          ...baseData,
          summary: 'Technical expert specializing in engineering solutions and system architecture.',
          skills: ['System Design', 'DevOps', 'Cloud Architecture', 'CI/CD', 'Kubernetes', 'Docker'],
        }
      default:
        return baseData
    }
  }

  // Compute ATS score dynamically
  const atsScore = useMemo(() => computeATSScore(resumeData), [resumeData])
  const atsStrokeDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 42 // ~264
    return circumference - (atsScore / 100) * circumference
  }, [atsScore])

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
      toast.success('Changes saved to server')
    },
    onError: () => {
      setIsSaving(false)
      // Fallback: save locally
      localStorage.setItem(`smartats-draft-${id || 'new'}`, JSON.stringify(resumeData))
      toast.success('Draft saved locally')
    },
  })

  const handleSave = () => {
    setIsSaving(true)
    // Always save to localStorage first
    localStorage.setItem(`smartats-draft-${id || 'new'}`, JSON.stringify(resumeData))
    if (id) {
      // Include ATS score in the update
      updateMutation.mutate({ ...resumeData, ats_score: atsScore })
    } else {
      // No server ID, just save locally
      setTimeout(() => {
        setIsSaving(false)
        toast.success('Draft saved locally!')
      }, 300)
    }
  }

  const handleDownload = useCallback(() => {
    toast.loading('Generating PDF...', { id: 'pdf-gen' })
    
    // Track download if resume has an ID
    if (id) {
      resumeAPI.update(id, { downloads: 1 }).catch(() => {
        // Silently fail if tracking fails
      })
    }
    
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentW = pageW - margin * 2
    let y = 20

    // Name
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.setTextColor(30, 41, 59)
    doc.text(resumeData.contact.name.toUpperCase(), margin, y)
    y += 10

    // Accent line
    doc.setDrawColor(80, 72, 229)
    doc.setLineWidth(0.8)
    doc.line(margin, y, pageW - margin, y)
    y += 6

    // Contact row
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    const contactParts = [resumeData.contact.email, resumeData.contact.phone, resumeData.contact.location, resumeData.contact.website].filter(Boolean)
    doc.text(contactParts.join('  |  '), margin, y)
    y += 10

    const drawSectionHeader = (title: string) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(80, 72, 229)
      doc.text(title.toUpperCase(), margin, y)
      y += 1.5
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.3)
      doc.line(margin, y, pageW - margin, y)
      y += 5
    }

    // Summary
    drawSectionHeader('Professional Summary')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(51, 65, 85)
    const summaryLines = doc.splitTextToSize(resumeData.summary, contentW)
    doc.text(summaryLines, margin, y)
    y += summaryLines.length * 5 + 6

    // Experience
    drawSectionHeader('Experience')
    resumeData.experience.forEach(exp => {
      if (y > 260) { doc.addPage(); y = 20 }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(30, 41, 59)
      doc.text(`${exp.title} | ${exp.company}`, margin, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      const dateStr = `${exp.startDate} — ${exp.endDate}`
      doc.text(dateStr, pageW - margin - doc.getTextWidth(dateStr), y)
      y += 5
      exp.description.forEach(desc => {
        if (y > 275) { doc.addPage(); y = 20 }
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(51, 65, 85)
        const lines = doc.splitTextToSize(`• ${desc}`, contentW - 5)
        doc.text(lines, margin + 3, y)
        y += lines.length * 4.5
      })
      y += 4
    })

    // Education
    drawSectionHeader('Education')
    resumeData.education.forEach(edu => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(30, 41, 59)
      doc.text(`${edu.degree} | ${edu.school}`, margin, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text(edu.year, pageW - margin - doc.getTextWidth(edu.year), y)
      y += 6
    })
    y += 4

    // Skills
    drawSectionHeader('Skills')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(51, 65, 85)
    const skillText = resumeData.skills.join('  •  ')
    const skillLines = doc.splitTextToSize(skillText, contentW)
    doc.text(skillLines, margin, y)
    y += skillLines.length * 4.5 + 6

    // Certifications
    if (resumeData.certifications.length > 0) {
      drawSectionHeader('Certifications')
      resumeData.certifications.forEach(cert => {
        if (y > 275) { doc.addPage(); y = 20 }
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(51, 65, 85)
        doc.text(`• ${cert}`, margin + 3, y)
        y += 5
      })
    }

    const filename = `${resumeData.contact.name.replace(/\s+/g, '_')}_Resume.pdf`
    doc.save(filename)
    toast.success('Resume downloaded!', { id: 'pdf-gen' })
  }, [resumeData, id])

  const handleFullAudit = () => {
    const result = performAIAudit(resumeData)
    setAuditResult(result)
    setShowAuditModal(true)
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
            <button 
              onClick={() => setSelectedTemplate('modern')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedTemplate === 'modern' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Modern
            </button>
            <button 
              onClick={() => setSelectedTemplate('executive')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedTemplate === 'executive' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Executive
            </button>
            <button 
              onClick={() => setSelectedTemplate('creative')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedTemplate === 'creative' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Creative
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
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
              <span className="text-xs font-bold text-primary">{atsScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${atsScore}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {atsScore >= 80 ? 'Excellent! Your resume is well-optimized.' : atsScore >= 60 ? 'Good progress! Keep improving.' : 'Add more content to boost your score.'}
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
                    strokeDashoffset={atsStrokeDashoffset}
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  ></circle>
                </svg>
                <span className="absolute text-2xl font-black text-slate-900 dark:text-white">
                  {atsScore}%
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
            <button
              onClick={handleFullAudit}
              className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-5 h-5" />
              Full AI Audit
            </button>
          </div>
        </aside>
      </main>

      {/* AI Audit Modal */}
      {showAuditModal && auditResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Resume Audit</h2>
                  <p className="text-xs text-slate-500">Comprehensive analysis of your resume</p>
                </div>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                <div className="text-5xl font-black text-primary mb-2">{auditResult.overallScore}%</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall Resume Score</p>
                <p className="text-xs text-slate-500 mt-1">
                  {auditResult.overallScore >= 80 ? '🎉 Excellent! Your resume is highly optimized.' : auditResult.overallScore >= 60 ? '👍 Good foundation. Some areas need improvement.' : '⚡ Needs work. Follow the suggestions below.'}
                </p>
              </div>

              {/* Section Scores */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Section Analysis
                </h3>
                <div className="flex flex-col gap-3">
                  {auditResult.sections.map((sec, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{sec.name}</span>
                        <span className={`text-sm font-black ${sec.score >= 80 ? 'text-emerald-600' : sec.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{sec.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-2">
                        <div className={`h-full rounded-full transition-all ${sec.score >= 80 ? 'bg-emerald-500' : sec.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sec.score}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-500">{sec.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Keyword Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">✓ Found ({auditResult.keywords.found.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {auditResult.keywords.found.map((k, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                    <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2">✗ Missing ({auditResult.keywords.missing.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {auditResult.keywords.missing.map((k, i) => (
                        <span key={i} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              {auditResult.actionItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> Action Items
                  </h3>
                  <div className="flex flex-col gap-2">
                    {auditResult.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800 dark:text-amber-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
