import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, Lightbulb, TrendingUp, Target } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function AIAssistantPage() {
  const { user } = useAuthStore()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI resume assistant. I can help you improve your resume, suggest better phrasing, or answer questions about your career. How can I help you today?',
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return
    
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setMessage('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Great question! Based on your experience, I recommend highlighting your leadership skills and quantifying your achievements with specific metrics.',
      }])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">AI Assistant</span>
              </div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">{user?.name}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <Lightbulb className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold text-sm">Improve Content</h3>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold text-sm">Optimize ATS</h3>
          </div>
          <div className="card text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold text-sm">Match Jobs</h3>
          </div>
        </div>

        <div className="flex-1 card overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your resume..."
            className="input flex-1"
          />
          <button onClick={handleSend} className="btn-primary px-6">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
