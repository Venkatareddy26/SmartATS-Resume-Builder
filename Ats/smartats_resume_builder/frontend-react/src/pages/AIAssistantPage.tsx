import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, Lightbulb, TrendingUp, Target, Loader2, Key } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIAssistantPage() {
  const { user } = useAuthStore()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI resume assistant. I can help you improve your resume, suggest better phrasing, optimize for ATS, or answer questions about your career. How can I help you today?',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // API Key state for Free College Project approach
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('smartats_gemini_api_key') || '')
  const [showSettings, setShowSettings] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSaveApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem('smartats_gemini_api_key', val);
  }

  const handleSend = async () => {
    if (!message.trim() || isLoading) return
    
    if (!apiKey) {
      toast.error("Please enter an API Key, or type 'demo' for the free simulation")
      setShowSettings(true)
      return
    }

    const userMessage = message.trim()
    setMessage('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // If no API key is provided, use our Mock AI (College Project Demo Mode)
      if (!apiKey || apiKey.toLowerCase() === 'demo') {
        // College Project Mock AI Simulator
        setTimeout(() => {
          let mockResponse = "I am a simulated AI for your college project! ";
          const lowerMsg = userMessage.toLowerCase();
          
          if (lowerMsg.includes("summary")) {
            mockResponse = "To improve your summary, focus on quantifiable achievements rather than just listing responsibilities. For example, instead of 'Developed web apps', use 'Developed 3 scalable React web applications, increasing user engagement by 20%'.";
          } else if (lowerMsg.includes("ats") || lowerMsg.includes("optimize")) {
            mockResponse = "To beat ATS systems, ensure you are using exact keyword matches from the job description. Avoid complex formatting like tables, graphics, or multi-columns, as ATS might fail to parse them. Stick to standard headings like 'Experience' and 'Education'.";
          } else if (lowerMsg.includes("keyword") || lowerMsg.includes("software engineer")) {
            mockResponse = "For a Software Engineer role, crucial keywords include: JavaScript, React, Node.js, API Design, System Architecture, Agile, CI/CD, and Cloud (AWS/Azure). Make sure to mention these naturally in your experience bullet points!";
          } else {
            mockResponse = "That's a great question about " + userMessage.split(' ').slice(0, 3).join(' ') + "... As an AI, I recommend making sure your resume is tailored specifically to the role you are applying for. Make sure your formatting is clean and professional!";
          }

          setMessages(prev => [...prev, { role: 'assistant', content: mockResponse }]);
          setIsLoading(false);
        }, 1500); // simulate network delay
        return;
      }

      let aiResponseText = '';

      if (apiKey.startsWith('sk-or-')) {
        // OpenRouter API (OpenAI Models)
        const openRouterMessages = [
          { role: 'system', content: "You are 'SmartATS Assistant', an expert AI resume assistant helping a job seeker. Provide precise, actionable advice on resume structuring, ATS optimization, and keyword targeting. Be encouraging but professional." },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage }
        ].filter(msg => msg.content.trim() !== '');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "openai/gpt-3.5-turbo", // Uses OpenAI Chat model via OpenRouter
            "messages": openRouterMessages,
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to get OpenRouter AI response');
        }

        const data = await response.json();
        aiResponseText = data.choices?.[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
      } else {
        // If they provide a real API key (not OpenRouter), try Google Gemini
        const geminiMessages = [...messages, { role: 'user', content: userMessage }]
          .filter(msg => msg.content.trim() !== '')
          .map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }))

        if (geminiMessages.length > 0 && geminiMessages[0].role === 'model') {
          geminiMessages.shift()
        }

        if (geminiMessages.length > 0 && geminiMessages[0].role === 'user') {
          geminiMessages[0].parts[0].text = "System Context: You are 'SmartATS Assistant'... \n\nUser query: " + geminiMessages[0].parts[0].text;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: geminiMessages }),
        })

        if (!response.ok) {
          const errorData = await response.json();
          
          // Handle "limit: 0" error specifically
          if (errorData.error?.message?.includes("limit: 0")) {
            throw new Error("Free tier is disabled for your Google account/region. Try typing 'demo' as your API key for a free College Project simulation!");
          }
          
          throw new Error(errorData.error?.message || 'Failed to get AI response')
        }

        const data = await response.json()
        aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I couldn\'t generate a response. Please try again.'
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponseText,
      }])
    } catch (error: any) {
      console.error('AI Chat error:', error)
      toast.error(error.message || 'Failed to get AI response. Please try again.')
      
      if (error.message?.toLowerCase().includes('api key not valid')) {
        setApiKey('')
        localStorage.removeItem('smartats_gemini_api_key')
        setShowSettings(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt)
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
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                  showSettings || !apiKey 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' 
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">API Key</span>
              </button>
              
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

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

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
        {(!apiKey || showSettings) && (
          <div className="mb-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            
            <div className="w-12 h-12 bg-white dark:bg-amber-900/50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-amber-100 dark:border-amber-800">
              <Key className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-base font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                Setup Free API Key
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded-full tracking-wider border border-green-200 dark:border-green-800">No Billing API</span>
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300/80 mb-3 mt-1 leading-relaxed">
                To use a real AI, enter a Gemini or OpenRouter API Key. <br/>
                <strong>For your College Project Demo:</strong> Just type <b>demo</b> in the box below to use our free built-in Mock AI Simulator! No Google account or billing required.
              </p>
              <div className="flex gap-2 relative z-10 w-full max-w-lg">
                <input
                  type="password"
                  placeholder="Type 'demo', or paste an OpenRouter/Gemini API key"
                  value={apiKey}
                  onChange={handleSaveApiKey}
                  className="w-full px-4 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-700/50 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 transition-colors font-mono"
                />
                {apiKey && (
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => handleQuickPrompt('How can I improve my resume summary?')}
            className="card text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-800 border-2 border-transparent hover:border-primary/20"
          >
            <Lightbulb className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Improve Content</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Get phrasing suggestions</p>
          </button>
          <button 
            onClick={() => handleQuickPrompt('How do I optimize my resume for ATS systems?')}
            className="card text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-800 border-2 border-transparent hover:border-primary/20"
          >
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Optimize ATS</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Beat the bots</p>
          </button>
          <button 
            onClick={() => handleQuickPrompt('What keywords should I include for a software engineer role?')}
            className="card text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-800 border-2 border-transparent hover:border-primary/20"
          >
            <Target className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Match Jobs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target specific roles</p>
          </button>
        </div>

        <div className="flex-1 card overflow-y-auto mb-4 space-y-6 max-h-[500px] p-6 bg-white dark:bg-slate-800 shadow-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20'
                    : 'bg-slate-100 dark:bg-slate-700/50 rounded-tl-sm text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed m-0 text-[15px]">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={apiKey ? "Ask me anything about your resume..." : "Type 'demo' in settings to enable simulation..."}
              className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-slate-800 dark:text-slate-200 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900"
              disabled={isLoading || !apiKey}
            />
          </div>
          <button 
            onClick={handleSend} 
            className="px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center min-w-[80px]"
            disabled={isLoading || !message.trim() || !apiKey}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  )
}
