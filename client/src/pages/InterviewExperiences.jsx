import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../hooks/useApi'
import Modal from '../components/Modal'
import Icon from '../components/Icon'
import Loader from '../components/Loader'

const difficultyColors = { Easy: 'bg-emerald-50 text-emerald-600', Medium: 'bg-amber-50 text-amber-600', Hard: 'bg-red-50 text-red-500' }
const cardGradients = [['#4f46e5','#818cf8'],['#0891b2','#06b6d4'],['#059669','#10b981'],['#d97706','#f59e0b']]
const emptyForm = { company: '', position: '', type: 'On-Campus', difficulty: 'Medium', result: 'Selected', location: '', salary: '', tags: '', content: '' }
const filters = ['All','Google','Microsoft','Amazon','Flipkart','Selected','Rejected','Hard','Medium','Easy']

export default function InterviewExperiences() {
  const { user, role } = useAuth()
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [viewItem, setViewItem] = useState(null)
  const [editId,   setEditId]   = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [filter,   setFilter]   = useState('All')
  const [form,     setForm]     = useState(emptyForm)

  const load = () => api.get('/interviews').then(r => { setItems(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const filtered = filter === 'All' ? items
    : items.filter(i => i.company === filter || i.result === filter || i.difficulty === filter)

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setModal(true) }
  const openEdit = (i) => { setForm({ ...i, tags: i.tags.join(', ') }); setEditId(i._id); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    const body = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editId) await api.put(`/interviews/${editId}`, body)
      else        await api.post('/interviews', body)
      await load(); setModal(false)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return
    await api.delete(`/interviews/${id}`)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const canEdit = (item) => {
    if (role === 'admin') return true
    return item.student?._id === user._id || item.student === user._id
  }

  if (loading) return <Loader />

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Interview Experiences</h1>
          <p className="text-slate-500 text-sm">{items.length} experiences shared by students</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Icon name="plus" size={15} />Share Experience</button>
      </div>

      {/* <div className="flex gap-2 flex-wrap mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`tab-btn ${filter === f ? 'active' : ''}`}>{f}</button>
        ))}
      </div> */}

      {filtered.length === 0 && (
        <div className="card p-12 text-center text-slate-400">
          <Icon name="star" size={40} className="mx-auto mb-3 opacity-30" />
          <p>No experiences found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((i, idx) => {
          const [from, to] = cardGradients[idx % cardGradients.length]
          const date = i.createdAt ? new Date(i.createdAt).toLocaleDateString('en-IN',{month:'short',year:'numeric'}) : ''
          return (
            <div key={i._id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div style={{ background: `linear-gradient(135deg,${from},${to})` }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                    {i.company[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{i.company}</div>
                    <div className="text-sm text-slate-500">{i.position}</div>
                  </div>
                </div>
                <span className={`badge ${i.result === 'Selected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {i.result === 'Selected' ? '✓ Selected' : '✗ Rejected'}
                </span>
              </div>

              <div className="flex gap-2 mb-3 flex-wrap">
                <span className={`badge text-xs ${difficultyColors[i.difficulty]}`}>{i.difficulty}</span>
                <span className="badge text-xs bg-slate-100 text-slate-600">{i.type}</span>
                {i.salary && <span className="badge text-xs bg-blue-50 text-blue-600">💰 {i.salary}</span>}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">{i.tags?.map(t => <span key={t} className="chip">{t}</span>)}</div>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{i.content}</p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">{i.author} · {date}</div>
                <div className="flex gap-2">
                  <button className="btn-secondary py-2 px-3 text-xs" onClick={() => setViewItem(i)}>
                    <Icon name="eye" size={13} />View
                  </button>
                  {canEdit(i) && (
                    <>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={() => openEdit(i)}><Icon name="edit" size={13} /></button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={() => handleDelete(i._id)}><Icon name="trash" size={13} /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* View modal */}
      {viewItem && (
        <Modal open={!!viewItem} onClose={() => setViewItem(null)} title={`${viewItem.company} — ${viewItem.position}`}>
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className={`badge ${viewItem.result === 'Selected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>{viewItem.result}</span>
              <span className={`badge ${difficultyColors[viewItem.difficulty]}`}>{viewItem.difficulty}</span>
              <span className="badge bg-slate-100 text-slate-600">{viewItem.type}</span>
              {viewItem.salary && <span className="badge bg-blue-50 text-blue-600">{viewItem.salary}</span>}
              <span className="badge bg-slate-100 text-slate-600">📍 {viewItem.location}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">{viewItem.tags?.map(t => <span key={t} className="chip">{t}</span>)}</div>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed">{viewItem.content}</div>
            <div className="text-xs text-slate-400 mt-3">Shared by {viewItem.author}</div>
          </div>
        </Modal>
      )}

      {/* Add/Edit modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Experience' : 'Share Interview Experience'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'Company', key: 'company', ph: 'e.g. Google' }, { label: 'Position', key: 'position', ph: 'e.g. SDE-1' }, { label: 'Location', key: 'location', ph: 'e.g. Bengaluru' }, { label: 'Salary / Package', key: 'salary', ph: 'e.g. ₹40 LPA' }].map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input type="text" className="input-field" placeholder={f.ph} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: 'Interview Type', key: 'type', opts: ['On-Campus','Off-Campus','Referral','Walk-in'] }, { label: 'Difficulty', key: 'difficulty', opts: ['Easy','Medium','Hard'] }, { label: 'Result', key: 'result', opts: ['Selected','Rejected','On Hold'] }].map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <select className="input-field" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input type="text" className="input-field" placeholder="e.g. DSA, System Design, HR" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div>
            <label className="label">Your Experience</label>
            <textarea className="input-field resize-none" rows={5} placeholder="Describe the interview process, rounds, questions asked…" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}><Icon name="save" size={15} />{saving ? 'Publishing…' : editId ? 'Save' : 'Publish Experience'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
