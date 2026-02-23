import { Link } from 'react-router-dom'
import { Sparkles, FileText, Zap, TrendingUp, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight">SmartATS</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold hover:text-primary px-4 py-2">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              NEW: AI INTERVIEW PREP
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
              Build a Resume <br />
              <span className="text-primary">That Gets You Hired</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
              Use AI to tailor your resume to job descriptions and stand out to recruiters with data-backed content optimization.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 text-center">
                Start Building for Free
              </Link>
              <Link to="/dashboard" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Try Demo
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-3 transform scale-105"></div>
            <div className="relative w-full aspect-[4/5] max-w-md card transform hover:scale-[1.01] transition-transform">
              <div className="space-y-4">
                <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="space-y-2 pt-4">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                  <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary">AI SUGGESTION</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    "Quantify your achievement: Rephrase to 'Increased sales by 25% over 6 months through targeted lead gen strategies'."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-slate-50 dark:bg-background-dark" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">
              Powerful Features
            </h2>
            <p className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Optimize Your Career Path
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Optimization',
                description: 'Scan job descriptions and automatically align your skills and experience with what recruiters are looking for.',
              },
              {
                icon: FileText,
                title: 'ATS-Friendly Templates',
                description: 'Clean, professional layouts designed to be parsed perfectly by applicant tracking systems every single time.',
              },
              {
                icon: TrendingUp,
                title: 'Real-time Suggestions',
                description: 'Get instant feedback on your writing style, impact verbs, and phrasing improvements as you type.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl bg-primary p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 relative z-10">
            Ready to land your dream job?
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary text-xl font-bold px-10 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-transform relative z-10"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs font-medium text-slate-400">
            <p>© 2026 SmartATS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
