export default function Filters({ filters, setFilters, categories, regions }) {

  function handleChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function resetAll() {
    setFilters({ category: 'All', region: 'All', dateFrom: '', dateTo: '' })
  }

  const hasActive =
    filters.category !== 'All' ||
    filters.region   !== 'All' ||
    filters.dateFrom !== ''    ||
    filters.dateTo   !== ''

  return (
    <div className="filters-card">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>
          <i className="bi bi-funnel me-2 text-primary"></i>Filters
        </span>
        {hasActive && (
          <button
            className="btn btn-sm btn-outline-secondary"
            style={{ fontSize: '0.78rem', borderRadius: 8 }}
            onClick={resetAll}
          >
            <i className="bi bi-x-circle me-1"></i>Reset
          </button>
        )}
      </div>

      <div className="row g-3">
        <div className="col-6 col-md-3">
          <span className="filter-label">Category</span>
          <select
            className="form-select form-select-sm"
            value={filters.category}
            onChange={e => handleChange('category', e.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3">
          <span className="filter-label">Region</span>
          <select
            className="form-select form-select-sm"
            value={filters.region}
            onChange={e => handleChange('region', e.target.value)}
          >
            <option value="All">All regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3">
          <span className="filter-label">Date from</span>
          <input
            type="date"
            className="form-control form-control-sm"
            value={filters.dateFrom}
            onChange={e => handleChange('dateFrom', e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3">
          <span className="filter-label">Date to</span>
          <input
            type="date"
            className="form-control form-control-sm"
            value={filters.dateTo}
            onChange={e => handleChange('dateTo', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
