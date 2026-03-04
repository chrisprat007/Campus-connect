import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../hooks/useApi'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import Loader from '../../components/Loader'

const emptyForm = { company: '', role: '', duration: '', description: '', location: '', stipend: '' }

export default function Internships() {
  const { user }   = useAuth()
  const [items,    setItems]   = useState([])
  const [loading,  setLoading] = useState(true)
  const [modal,    setModal]   = useState(false)
  const [saving,   setSaving]  = useState(false)
  const [editId,   setEditId]  = useState(null)
  const [form,     setForm]    = useState(emptyForm)

  const load = () => api.get(`/students/${user._id}/internships`).then(r => { setItems(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setModal(true) }
  const openEdit = (i) => { setForm(i); setEditId(i._id); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await api.put(`/students/${user._id}/internships/${editId}`, form)
      else        await api.post(`/students/${user._id}/internships`, form)
      await load(); setModal(false)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this internship?')) return
    await api.delete(`/students/${user._id}/internships/${id}`)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  if (loading) return <Loader />

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Internships</h1>
          <p className="text-slate-500 text-sm">{items.length} internship experiences</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Icon name="plus" size={15} />Add Internship</button>
      </div>

      {items.length === 0 && (
        <div className="card p-12 text-center text-slate-400">
          <Icon name="briefcase" size={40} className="mx-auto mb-3 opacity-30" />
          <p>No internships yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((i) => (
          <div key={i._id} className="card p-6">
            <div className="flex items-start gap-4">
              <div style={{ background: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)' }} className="w-12 h-12 rounded-xl flex items-center justify-center text-emerald-700 font-extrabold flex-shrink-0">
                {i.company[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{i.role}</h3>
                    <div className="text-brand-600 font-semibold text-sm">{i.company}</div>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-slate-400">📅 {i.duration}</span>
                      <span className="text-xs text-slate-400">📍 {i.location}</span>
                      <span className="text-xs text-emerald-600 font-semibold">💰 {i.stipend}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={() => openEdit(i)}><Icon name="edit" size={14} /></button>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={() => handleDelete(i._id)}><Icon name="trash" size={14} /></button>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">{i.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Internship' : 'Add Internship'}>
        <div className="space-y-4">
          {[{ label: 'Company Name', key: 'company', ph: 'e.g. Razorpay' }, { label: 'Role / Position', key: 'role', ph: 'e.g. SDE Intern' }, { label: 'Duration', key: 'duration', ph: 'e.g. May–Aug 2024' }, { label: 'Location', key: 'location', ph: 'e.g. Bengaluru / Remote' }, { label: 'Stipend', key: 'stipend', ph: 'e.g. ₹40,000/mo' }].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input type="text" className="input-field" placeholder={f.ph} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <div>
            <label className="label">Description</label>
            <textarea className="input-field resize-none" rows={3} placeholder="What did you build, achieve, or learn?" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}><Icon name="save" size={15} />{saving ? 'Saving…' : editId ? 'Save' : 'Add Internship'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
