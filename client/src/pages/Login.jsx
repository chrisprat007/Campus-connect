import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'

export default function Login() {
  const [tab,      setTab]      = useState('login')   // 'login' | 'register'
  const [role,     setRole]     = useState('student')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', cgpa: '', batch: '',
    domain: '', department: '', resumeUrl: '',
  })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      if (tab === 'login') {
        const data = await login(form.email, form.password, role)
        navigate(data.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
      } else {
        const data = await register({ ...form, cgpa: parseFloat(form.cgpa) || 0 }, role)
        navigate(data.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg,#eef2ff 0%,#f8fafc 50%,#e0e7ff 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <div>
          <div className="flex items-center gap-4 mb-12">
            <div style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-xl">P</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800">PlaceIQ</div>
              <div className="text-slate-500 text-sm">Campus Placement Intelligence</div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-slate-800 leading-tight mb-6">Your career<br />starts here.</h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md">Track placements, share interview experiences, and get AI-powered career guidance — all in one platform.</p>
          <div className="grid grid-cols-2 gap-4">
            {[['847','Students Registered'],['312','Interview Experiences'],['73%','Placement Rate'],['50+','Partner Companies']].map(([n,l])=>(
              <div key={l} className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-white">
                <div className="text-2xl font-extrabold text-brand-600">{n}</div>
                <div className="text-slate-500 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-1">
                {tab === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-slate-500 text-sm">
                {tab === 'login' ? 'Sign in to continue' : 'Join the placement platform'}
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
              {['login','register'].map(t => (
                <button key={t} onClick={() => { setTab(t); setError('') }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${tab===t ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}>
                  {t === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {/* Role toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
              {['student','admin'].map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${role===r ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}>
                  {r === 'student' ? '🎓 Student' : '⚙️ Admin'}
                </button>
              ))}
            </div>

            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

            <div className="space-y-3">
              {tab === 'register' && (
                <div>
                  <label className="label">Full Name</label>
                  <input className="input-field" placeholder="Arjun Mehta" value={form.name} onChange={set('name')} />
                </div>
              )}
              <div>
                <label className="label">Email Address</label>
                <input className="input-field" type="email" placeholder={role === 'student' ? 'arjun@university.edu' : 'admin@university.edu'} value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
              </div>
              {tab === 'register' && role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Phone</label>
                      <input className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                    </div>
                    <div>
                      <label className="label">CGPA</label>
                      <input className="input-field" type="number" step="0.1" placeholder="8.5" value={form.cgpa} onChange={set('cgpa')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Batch</label>
                      <input className="input-field" placeholder="2021-2025" value={form.batch} onChange={set('batch')} />
                    </div>
                    <div>
                      <label className="label">Department</label>
                      <input className="input-field" placeholder="CSE" value={form.department} onChange={set('department')} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Domain</label>
                    <input className="input-field" placeholder="Full Stack Development" value={form.domain} onChange={set('domain')} />
                  </div>
                </>
              )}
            </div>

            <button className="btn-primary w-full justify-center py-3 text-base mt-5" onClick={handleSubmit} disabled={loading}>
              {loading ? <span style={{ animation: 'pulse 1s infinite' }}>Please wait…</span>
                : <>{tab === 'login' ? 'Sign In' : 'Create Account'} <Icon name="check" size={16} /></>}
            </button>

            {tab === 'login' && (
              <p className="text-center text-xs text-slate-400 mt-3">
                Demo — Student: arjun@university.edu / student123 &nbsp;|&nbsp; Admin: admin@university.edu / admin123
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
