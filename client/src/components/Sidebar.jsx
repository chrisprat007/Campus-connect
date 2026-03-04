import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'

const studentLinks = [
  { path: '/student/dashboard',       label: 'Dashboard',      icon: 'home' },
  { path: '/student/profile',         label: 'My Profile',     icon: 'user' },
  { path: '/student/projects',        label: 'Projects',       icon: 'folder' },
  { path: '/student/certifications',  label: 'Certifications', icon: 'certificate' },
  { path: '/student/internships',     label: 'Internships',    icon: 'briefcase' },
  { path: '/student/achievements',    label: 'Achievements',   icon: 'award' },
  { path: '/interviews',              label: 'Interview Exp.', icon: 'star' },
  { path: '/student/chatbot',         label: 'AI Assistant',   icon: 'bot' },
]

const adminLinks = [
  { path: '/admin/dashboard',  label: 'Dashboard',      icon: 'grid' },
  { path: '/admin/students',   label: 'Students',       icon: 'users' },
  { path: '/interviews',       label: 'Interview Exp.', icon: 'star' },
]

export default function Sidebar() {
  const navigate        = useNavigate()
  const { pathname }    = useLocation()
  const { role, user, logout } = useAuth()
  const links           = role === 'admin' ? adminLinks : studentLinks

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.avatar || user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen flex flex-col fixed left-0 top-0 z-20 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)' }} className="w-9 h-9 rounded-xl flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">P</span>
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm leading-tight">PlaceIQ</div>
            <div className="text-xs text-slate-400 capitalize">{role} Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <button key={l.path} onClick={() => navigate(l.path)}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 text-left ${pathname === l.path ? 'active' : ''}`}>
            <Icon name={l.icon} size={16} />
            {l.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        {role === 'student' && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div style={{ background: 'linear-gradient(135deg,#4f46e5,#818cf8)' }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-700 truncate">{user?.name}</div>
              <div className="text-xs text-slate-400">{user?.department?.split(' ')[0] || 'Student'}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-500 hover:bg-red-50">
          <Icon name="logout" size={16} />Logout
        </button>
      </div>
    </aside>
  )
}
