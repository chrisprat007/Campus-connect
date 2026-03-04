import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../hooks/useApi'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import Loader from '../../components/Loader'

const emptyForm = { title: '', issuer: '', date: '', credential: '' }

export default function Certifications() {
  const { user }  = useAuth()
  const [certs,   setCerts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [editId,  setEditId]  = useState(null)
  const [form,    setForm]    = useState(emptyForm)

  const load = () => api.get(`/students/${user._id}/certifications`).then(r => { setCerts(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setModal(true) }
  const openEdit = (c) => { setForm(c); setEditId(c._id); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await api.put(`/students/${user._id}/certifications/${editId}`, form)
      else        await api.post(`/students/${user._id}/certifications`, form)
      await load(); setModal(false)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this certification?')) return
    await api.delete(`/students/${user._id}/certifications/${id}`)
    setCerts(prev => prev.filter(c => c._id !== id))
  }

  if (loading) return <Loader />

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Certifications</h1>
          <p className="text-slate-500 text-sm">{certs.length} certifications earned</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Icon name="plus" size={15} />Add Certification</button>
      </div>

      {certs.length === 0 && (
        <div className="card p-12 text-center text-slate-400">
          <Icon name="award" size={40} className="mx-auto mb-3 opacity-30" />
          <p>No certifications yet.</p>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />
        <div className="space-y-4">
          {certs.map((c) => (
            <div key={c._id} className="flex gap-6 relative pl-14">
              <div className="timeline-dot absolute left-3.5" />
              <div className="card flex-1 p-5 flex items-center gap-4">
                <div style={{ background: 'linear-gradient(135deg,#eef2ff,#c7d2fe)' }} className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="award" size={18} className="text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800">{c.title}</div>
                  <div className="text-slate-500 text-sm">{c.issuer} · <span className="text-slate-400">{c.date}</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={c.credential} target="_blank" rel="noreferrer" className="btn-secondary py-2 px-3 text-xs"><Icon name="link" size={13} />Verify</a>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={() => openEdit(c)}><Icon name="edit" size={14} /></button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={() => handleDelete(c._id)}><Icon name="trash" size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Certification' : 'Add Certification'}>
        <div className="space-y-4">
          {[{ label: 'Certificate Title', key: 'title', ph: 'e.g. AWS Solutions Architect' }, { label: 'Issuing Organization', key: 'issuer', ph: 'e.g. Amazon Web Services' }, { label: 'Issue Date', key: 'date', ph: 'e.g. Oct 2024' }, { label: 'Credential URL', key: 'credential', ph: 'https://...' }].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input type="text" className="input-field" placeholder={f.ph} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}><Icon name="save" size={15} />{saving ? 'Saving…' : editId ? 'Save' : 'Add Certification'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
