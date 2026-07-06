export default function TopProductsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-table"></i>
        <p>No data matches the current filters.</p>
      </div>
    )
  }

  const maxRevenue = data[0]?.revenue || 1

  return (
    <div className="table-responsive">
      <table className="table table-sm mb-0" style={{ fontSize: '0.83rem' }}>
        <thead>
          <tr style={{ color: '#6c757d', borderBottom: '2px solid #f0f0f0' }}>
            <th className="fw-semibold border-0 pb-2">#</th>
            <th className="fw-semibold border-0 pb-2">Product</th>
            <th className="fw-semibold border-0 pb-2">Orders</th>
            <th className="fw-semibold border-0 pb-2">Revenue</th>
            <th className="fw-semibold border-0 pb-2">Share</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const pct = ((row.revenue / maxRevenue) * 100).toFixed(0)
            return (
              <tr key={row.name} style={{ borderBottom: '1px solid #f8f9fa' }}>
                <td className="border-0 text-muted">{i + 1}</td>
                <td className="border-0 fw-semibold">{row.name}</td>
                <td className="border-0 text-muted">{row.orders}</td>
                <td className="border-0" style={{ color: '#4361ee', fontWeight: 600 }}>
                  ₹{Number(row.revenue).toLocaleString('en-IN')}
                </td>
                <td className="border-0" style={{ minWidth: 80 }}>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: '#e9ecef',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: 3,
                        background: '#4361ee',
                      }}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
