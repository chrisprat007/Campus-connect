import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../hooks/useApi'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import Loader from '../../components/Loader'

const emptyForm = { name: '', description: '', tech: '', github: '' }

export default function Projects() {
  const { user }   = useAuth()
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [editId,   setEditId]   = useState(null)
  const [form,     setForm]     = useState(emptyForm)

  const load = () => api.get(`/students/${user._id}/projects`).then(r => { setProjects(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setModal(true) }
  const openEdit = (p) => { setForm({ ...p, tech: p.tech.join(', ') }); setEditId(p._id); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    const body = { ...form, tech: form.tech.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editId) await api.put(`/students/${user._id}/projects/${editId}`, body)
      else        await api.post(`/students/${user._id}/projects`, body)
      await load(); setModal(false)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    await api.delete(`/students/${user._id}/projects/${id}`)
    setProjects(prev => prev.filter(p => p._id !== id))
  }

  if (loading) return <Loader />

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Projects</h1>
          <p className="text-slate-500 text-sm">{projects.length} projects in your portfolio</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Icon name="plus" size={15} />Add Project</button>
      </div>

      {projects.length === 0 && (
        <div className="card p-12 text-center text-slate-400">
          <Icon name="folder" size={40} className="mx-auto mb-3 opacity-30" />
          <p>No projects yet. Add your first project!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((p) => (
          <div key={p._id} className="card p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div style={{ background: 'linear-gradient(135deg,#eef2ff,#c7d2fe)' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
                <Icon name="folder" size={18} className="text-brand-600" />
              </div>
              <div className="flex gap-1">
                <button className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" onClick={() => openEdit(p)}><Icon name="edit" size={14} /></button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={() => handleDelete(p._id)}><Icon name="trash" size={14} /></button>
              </div>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{p.name}</h3>
            <p className="text-slate-500 text-sm flex-1 mb-4 leading-relaxed">{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">{p.tech?.map(t => <span key={t} className="chip">{t}</span>)}</div>
            <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors font-medium">
              <Icon name="github" size={15} />View on GitHub <Icon name="link" size={13} />
            </a>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Project' : 'Add New Project'}>
        <div className="space-y-4">
          {[{ label: 'Project Name', key: 'name', ph: 'e.g. SmartCart AI' }, { label: 'GitHub URL', key: 'github', ph: 'https://github.com/...' }, { label: 'Technologies (comma-separated)', key: 'tech', ph: 'React, Node.js, MongoDB' }].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input type="text" className="input-field" placeholder={f.ph} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <div>
            <label className="label">Description</label>
            <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description…" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}><Icon name="save" size={15} />{saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Project'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
