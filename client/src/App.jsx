import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
// Pages
import Login                from './pages/Login'
import StudentDashboard     from './pages/student/Dashboard'
import Profile              from './pages/student/Profile'
import Projects             from './pages/student/Projects'
import Certifications       from './pages/student/Certifications'
import Internships          from './pages/student/Internships'
import Achievements         from './pages/student/Achievements'
import Chatbot              from './pages/student/Chatbot'
import InterviewExperiences from './pages/InterviewExperiences'
import AdminDashboard       from './pages/admin/Dashboard'
import AdminStudents        from './pages/admin/Students'
import AdminCompanies       from './pages/admin/Companies'

// ── Auth guard ─────────────────────────────────────────────────────────────
function RequireAuth({ children, allowedRole }) {
  const { user, role, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && role !== allowedRole) return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
  return children
}

// ── App shell with sidebar ─────────────────────────────────────────────────
function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen p-8">{children}</main>
    </div>
  )
}

function AppRoutes() {
  const { role } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Student routes */}
      <Route path="/student/dashboard" element={<RequireAuth allowedRole="student"><AppLayout><StudentDashboard /></AppLayout></RequireAuth>} />
      <Route path="/student/profile" element={<RequireAuth allowedRole="student"><AppLayout><Profile /></AppLayout></RequireAuth>} />
      <Route path="/student/projects" element={<RequireAuth allowedRole="student"><AppLayout><Projects /></AppLayout></RequireAuth>} />
      <Route path="/student/certifications" element={<RequireAuth allowedRole="student"><AppLayout><Certifications /></AppLayout></RequireAuth>} />
      <Route path="/student/internships" element={<RequireAuth allowedRole="student"><AppLayout><Internships /></AppLayout></RequireAuth>} />
      <Route path="/student/achievements" element={<RequireAuth allowedRole="student"><AppLayout><Achievements /></AppLayout></RequireAuth>} />
      <Route path="/student/chatbot" element={<RequireAuth allowedRole="student"><AppLayout><Chatbot /></AppLayout></RequireAuth>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<RequireAuth allowedRole="admin"><AppLayout><AdminDashboard /></AppLayout></RequireAuth>} />
      <Route path="/admin/students" element={<RequireAuth allowedRole="admin"><AppLayout><AdminStudents /></AppLayout></RequireAuth>} />
      <Route path="/admin/companies" element={<RequireAuth allowedRole="admin"><AppLayout><AdminCompanies /></AppLayout></RequireAuth>} />

      {/* Shared */}
      <Route path="/interviews" element={<RequireAuth><AppLayout><InterviewExperiences /></AppLayout></RequireAuth>} />

      {/* Default redirects */}
      <Route path="/" element={
        role === 'admin' ? <Navigate to="/admin/dashboard" replace />
        : role === 'student' ? <Navigate to="/student/dashboard" replace />
        : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
