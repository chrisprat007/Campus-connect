import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../hooks/useApi'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import Loader from '../../components/Loader'

const emptyForm = { title: '', category: 'Hackathon', description: '', date: '' }
const categories = ['Hackathon', 'Competitive Programming', 'Academic', 'Sports', 'Other']
const catColors = {
  Hackathon: 'bg-purple-50 text-purple-600',
  'Competitive Programming': 'bg-blue-50 text-blue-600',
  Academic: 'bg-amber-50 text-amber-600',
  Sports: 'bg-green-50 text-green-600',
}

export default function Achievements() {
  const { user }  = useAuth()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [editId,  setEditId]  = useState(null)
  const [form,    setForm]    = useState(emptyForm)

  const load = () => api.get(`/students/${user._id}/achievements`).then(r => { setItems(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setModal(true) }
  const openEdit = (i) => { setForm(i); setEditId(i._id); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await api.put(`/students/${user._id}/achievements/${editId}`, form)
      else        await api.post(`/students/${user._id}/achievements`, form)
      await load(); setModal(false)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this achievement?')) return
    await api.delete(`/students/${user._id}/achievements/${id}`)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  if (loading) return <Loader />

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Achievements</h1>
          <p className="text-slate-500 text-sm">{items.length} achievements recorded</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Icon name="plus" size={15} />Add Achievement</button>
      </div>

      {items.length === 0 && (
        <div className="card p-12 text-center text-slate-400">
          <Icon name="award" size={40} className="mx-auto mb-3 opacity-30" />
          <p>No achievements yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((i) => (
          <div key={i._id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <span className={`badge ${catColors[i.category] || 'bg-slate-100 text-slate-600'}`}>{i.category}</span>
              <div className="flex gap-1">
                <button className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={() => openEdit(i)}><Icon name="edit" size={14} /></button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={() => handleDelete(i._id)}><Icon name="trash" size={14} /></button>
              </div>
            </div>
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-bold text-slate-800 mb-2">{i.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-3">{i.description}</p>
            <div className="text-xs text-slate-400">{i.date}</div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Achievement' : 'Add Achievement'}>
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input type="text" className="input-field" placeholder="e.g. Smart India Hackathon Winner" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="text" className="input-field" placeholder="e.g. Aug 2024" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the achievement…" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}><Icon name="save" size={15} />{saving ? 'Saving…' : editId ? 'Save' : 'Add Achievement'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
