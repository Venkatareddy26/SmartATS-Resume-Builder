import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Bell, Shield, CreditCard, LogOut, Save } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
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
                  <span className="text-white font-black text-xl">S</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight">Settings</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Bio</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="input w-full"
                    />
                  </div>
                  <button className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications', desc: 'Receive email updates about your resumes' },
                    { label: 'Job alerts', desc: 'Get notified about matching job opportunities' },
                    { label: 'Resume views', desc: 'Know when someone views your resume' },
                    { label: 'Weekly summary', desc: 'Receive weekly analytics reports' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Current Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">New Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>
                <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Current Plan</p>
                      <p className="text-2xl font-black text-primary">Free</p>
                    </div>
                    <button className="btn-primary">Upgrade to Pro</button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upgrade to Pro for unlimited resumes, advanced AI features, and priority support.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold">Payment Method</h3>
                  <p className="text-sm text-slate-500">No payment method on file</p>
                  <button className="btn-secondary">Add Payment Method</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
