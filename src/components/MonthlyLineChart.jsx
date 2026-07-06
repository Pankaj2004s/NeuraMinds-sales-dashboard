import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
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
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#4361ee' }}>
          Revenue: ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </p>
        {payload[1] && (
          <p style={{ color: '#f72585' }}>
            Orders: {payload[1].value}
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function MonthlyLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-graph-up"></i>
        <p>No data matches the current filters.</p>
      </div>
    )
  }

  const formatted = data.map(d => {
    const [year, month] = d.month.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    const label = date.toLocaleString('default', { month: 'short' }) + ' ' + String(year).slice(2)
    return { ...d, label }
  })

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={formatted} margin={{ top: 4, right: 8, left: 10, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip
          content={<CustomTooltip />}
          isAnimationActive={false}
          cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#4361ee"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#4361ee', stroke: '#fff', strokeWidth: 2 }}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
