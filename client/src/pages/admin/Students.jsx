import { useState, useEffect } from 'react'
import api from '../../hooks/useApi'
import Loader from '../../components/Loader'

const statusColors = { Placed: 'bg-emerald-50 text-emerald-600', 'Not Placed': 'bg-red-50 text-red-500', 'On Hold': 'bg-amber-50 text-amber-600' }

const avatarGradients = [
  ['#4f46e5','#818cf8'],['#0891b2','#06b6d4'],['#059669','#10b981'],['#d97706','#f59e0b'],
  ['#7c3aed','#a78bfa'],['#db2777','#f472b6'],['#0891b2','#38bdf8'],['#4f46e5','#818cf8'],
]

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get('/students').then(r => { setStudents(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Students</h1>
        <p className="text-slate-500 text-sm">{students.length} students registered</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Student','Department','CGPA','Batch','Projects','Internships'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const [from, to] = avatarGradients[idx % avatarGradients.length]
                const initials   = s.avatar || s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div style={{ background: `linear-gradient(135deg,${from},${to})` }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-700">{s.name}</div>
                          <div className="text-xs text-slate-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{s.department || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold ${s.cgpa >= 8.5 ? 'text-emerald-600' : s.cgpa >= 7.5 ? 'text-amber-600' : 'text-slate-500'}`}>
                        {s.cgpa || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{s.batch || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="badge text-xs bg-brand-50 text-brand-600">{s.projects?.length || 0}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge text-xs bg-emerald-50 text-emerald-600">{s.internships?.length || 0}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {students.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No students registered yet.</div>
        )}
      </div>
    </div>
  )
}
