import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAPI } from '../lib/api'
import { useAuthStore } from '../store/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLogin, setIsLogin] = useState(location.pathname === '/login')
  const [isLoading, setIsLoading] = useState(false)

  // Update form mode when location changes
  useState(() => {
    setIsLogin(location.pathname === '/login')
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  })

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setIsLoading(true)
    try {
      if (isLogin) {
        const response = await authAPI.login(data as LoginFormData)
        login(response.user, response.token)
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        const response = await authAPI.register(data as RegisterFormData)
        login(response.user, response.token)
        toast.success('Account created successfully!')
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    const newMode = !isLogin
    setIsLogin(newMode)
    reset()
    navigate(newMode ? '/login' : '/register')
  }

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight">SmartATS</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {isLogin
                ? 'Sign in to continue building your resume'
                : 'Start building your AI-powered resume'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="John Doe"
                    className="input pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="input pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••••"
                    className="input pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold text-primary">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 bg-primary p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <Sparkles className="w-12 h-12 mb-6" />
          <h2 className="text-4xl font-black mb-6">
            AI-Powered Resume Builder
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Create professional resumes that pass ATS systems and impress recruiters with AI-powered optimization.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Smart ATS Scoring</h3>
                <p className="text-white/80 text-sm">Get instant feedback on how well your resume matches job requirements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">AI Content Optimization</h3>
                <p className="text-white/80 text-sm">Improve your bullet points with AI-powered suggestions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Multiple Export Formats</h3>
                <p className="text-white/80 text-sm">Download as PDF, Word, or plain text</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
