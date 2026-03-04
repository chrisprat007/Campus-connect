import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../hooks/useApi'
import Icon from '../../components/Icon'
import Loader from '../../components/Loader'

const fields = [
  { label: 'Full Name',      key: 'name',       type: 'text' },
  { label: 'Email Address',  key: 'email',      type: 'email', readOnly: true },
  { label: 'Phone Number',   key: 'phone',      type: 'tel' },
  { label: 'CGPA',           key: 'cgpa',       type: 'number' },
  { label: 'Batch / Year',   key: 'batch',      type: 'text' },
  { label: 'Primary Domain', key: 'domain',     type: 'text' },
  { label: 'Department',     key: 'department', type: 'text' },
  { label: 'Resume URL',     key: 'resumeUrl',  type: 'url' },
]

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState({})
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get(`/students/${user._id}`).then(r => { setForm(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [user._id])

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const { data } = await api.put(`/students/${user._id}`, form)
      setForm(data)
      updateUser({ name: data.name, avatar: data.avatar })
      setSaved(true); setEditing(false)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) { setError(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  if (loading) return <Loader />

  const initials = form.avatar || form.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="fade-in max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm">Manage your personal and academic information</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                <Icon name="save" size={15} />{saving ? 'Saving…' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setEditing(true)}>
              <Icon name="edit" size={15} />Edit Profile
            </button>
          )}
        </div>
      </div>

      {saved  && <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center gap-2"><Icon name="check" size={16} />Profile saved!</div>}
      {error  && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      <div className="card p-6">
        <div className="flex items-center gap-5 mb-6">
          <div style={{ background: 'linear-gradient(135deg,#4f46e5,#818cf8)' }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold">
            {initials}
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{form.name}</div>
            <div className="text-slate-500 text-sm">{form.email}</div>
            <span className="chip mt-2">{form.department}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}{f.readOnly && <span className="ml-2 text-slate-300 normal-case">(read-only)</span>}</label>
              <input type={f.type} className="input-field" value={form[f.key] || ''}
                disabled={!editing || f.readOnly}
                style={(!editing || f.readOnly) ? { background: '#f8fafc', color: '#64748b' } : {}}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
