import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../hooks/useApi'
import StatCard from '../../components/StatCard'
import Loader from '../../components/Loader'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [student,    setStudent]    = useState(null)
  const [interviews, setInterviews] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, iRes] = await Promise.all([
          api.get(`/students/${user._id}`),
          api.get('/interviews'),
        ])
        setStudent(sRes.data)
        setInterviews(iRes.data.slice(0, 3))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [user._id])

  if (loading) return <Loader />

  const stats = [
    { label: 'CGPA',        value: student?.cgpa || '—',                    sub: 'Academic score',    from: '#4f46e5', to: '#818cf8', icon: 'star' },
    { label: 'Projects',    value: student?.projects?.length || 0,          sub: 'In portfolio',      from: '#0891b2', to: '#06b6d4', icon: 'folder' },
    { label: 'Internships', value: student?.internships?.length || 0,       sub: 'Experiences',       from: '#059669', to: '#10b981', icon: 'briefcase' },
    { label: 'Experiences', value: student?.achievements?.length || 0,      sub: 'Achievements',      from: '#d97706', to: '#f59e0b', icon: 'message' },
  ]

  const readiness = [
    ['DSA Skills', Math.min(100, (student?.projects?.length || 0) * 25 + 25)],
    ['System Design', 65],
    ['Resume Quality', student?.resumeUrl ? 90 : 40],
    ['Mock Interviews', student?.internships?.length ? 70 : 30],
  ]

  return (
    <div className="fade-in">
      <div className="mb-8">
        <p className="text-slate-500 text-sm mb-1">Good morning 👋</p>
        <h1 className="text-3xl font-extrabold text-slate-800">Welcome back, {student?.name?.split(' ')[0]}!</h1>
        <p className="text-slate-500 mt-1">You're on track for your placement goals. Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-bold text-slate-800 mb-4">Recent Interview Experiences</h3>
          {interviews.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No interview experiences yet. Be the first to share!</p>
          ) : (
            <div className="space-y-3">
              {interviews.map((i) => (
                <div key={i._id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)' }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {i.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-700 text-sm">{i.company} — {i.position}</div>
                    <div className="text-xs text-slate-400">{i.type} · {new Date(i.createdAt).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}</div>
                  </div>
                  <span className={`badge text-xs ${i.result === 'Selected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>{i.result}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-4">Placement Readiness</h3>
          <div className="space-y-4">
            {readiness.map(([label, val]) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{label}</span>
                  <span className="text-slate-400">{val}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${val}%`, background: 'linear-gradient(90deg,#4f46e5,#818cf8)', transition: 'width .8s ease' }} className="h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 rounded-xl" style={{ background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)' }}>
            <div className="text-xs font-semibold text-brand-700 mb-1">💡 AI Tip</div>
            <div className="text-xs text-brand-600">Focus on System Design this week. Practice designing a URL shortener and notification service.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
