import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#4361ee', '#7209b7', '#f72585', '#4cc9f0', '#f77f00', '#4895ef']

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0]
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: '0.82rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{d.name}</p>
        <p style={{ color: d.payload.fill }}>
          ₹{Number(d.value).toLocaleString('en-IN')}
        </p>
        <p style={{ color: '#6c757d' }}>{d.payload.percent}% of total</p>
      </div>
    )
  }
  return null
}

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-pie-chart"></i>
        <p>No data matches the current filters.</p>
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.revenue, 0)
  const withPercent = data.map(d => ({
    ...d,
    percent: ((d.revenue / total) * 100).toFixed(1),
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={withPercent}
          dataKey="revenue"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={55}
          paddingAngle={3}
          isAnimationActive={false}
        >
          {withPercent.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip />}
          isAnimationActive={false}
        />
        <Legend
          iconType="circle"
          iconSize={9}
          formatter={val => (
            <span style={{ fontSize: '0.78rem', color: '#495057' }}>{val}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
