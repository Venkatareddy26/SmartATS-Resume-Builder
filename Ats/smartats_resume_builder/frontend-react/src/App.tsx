import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Pages
import LandingPage from './pages/LandingPage.tsx'
import AuthPage from './pages/AuthPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import EditorPage from './pages/EditorPage.tsx'
import TemplatesPage from './pages/TemplatesPage.tsx'
import AIAssistantPage from './pages/AIAssistantPage.tsx'
import JobMatcherPage from './pages/JobMatcherPage.tsx'
import AnalyticsPage from './pages/AnalyticsPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/editor/:id?"
        element={isAuthenticated ? <EditorPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/templates"
        element={isAuthenticated ? <TemplatesPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/ai-assistant"
        element={isAuthenticated ? <AIAssistantPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/job-matcher"
        element={isAuthenticated ? <JobMatcherPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/analytics"
        element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/settings"
        element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
