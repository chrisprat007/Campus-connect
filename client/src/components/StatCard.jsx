import Icon from './Icon'

export default function StatCard({ label, value, sub, from, to, icon }) {
  return (
    <div className="stat-card" style={{ '--from': from, '--to': to }}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</div>
        <Icon name={icon} size={16} className="text-white/60" />
      </div>
      <div className="text-4xl font-extrabold text-white mb-1">{value}</div>
      <div className="text-white/70 text-xs">{sub}</div>
    </div>
  )
}
