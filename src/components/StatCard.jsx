export default function StatCard({ label, value, icon, bgColor, iconColor }) {
  return (
    <div className="stat-card h-100">
      <div className="d-flex align-items-center justify-content-between">
        <div
          className="icon-box"
          style={{ background: bgColor }}
        >
          <i className={`bi ${icon}`} style={{ color: iconColor }}></i>
        </div>
      </div>
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  )
}
