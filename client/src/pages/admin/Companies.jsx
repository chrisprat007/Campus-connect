// import { adminCompanies } // companies are static display

export default function AdminCompanies() {
  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Companies</h1>
        <p className="text-slate-500 text-sm">{adminCompanies.length} partner companies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {adminCompanies.map((c) => (
          <div key={c.name} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  style={{ background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)' }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-700 font-extrabold text-lg"
                >
                  {c.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.sector}</div>
                </div>
              </div>
              <span
                className={`badge text-xs ${
                  c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Visited</span>
                <span className="font-semibold text-slate-600">{c.visited}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hired</span>
                <span className="font-bold text-brand-600">{c.hired} students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Package</span>
                <span className="font-semibold text-emerald-600">{c.package}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {c.roles.map((r) => <span key={r} className="chip">{r}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
