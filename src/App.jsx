import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'

import { cleanData }           from './utils/cleanData'
import { readFiltersFromURL, writeFiltersToURL } from './utils/urlFilters'

import StatCard            from './components/StatCard'
import DataQualityPanel    from './components/DataQualityPanel'
import Filters             from './components/Filters'
import RevenueBarChart     from './components/RevenueBarChart'
import MonthlyLineChart    from './components/MonthlyLineChart'
import CategoryPieChart    from './components/CategoryPieChart'
import TopProductsTable    from './components/TopProductsTable'

export default function App() {
  const [allRows, setAllRows]   = useState([])
  const [issueLog, setIssueLog] = useState(null)
  const [rawCount, setRawCount] = useState(0)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const [filters, setFilters] = useState(readFiltersFromURL)

  useEffect(() => {
    fetch('/sales_data.csv')
      .then(res => {
        if (!res.ok) throw new Error('Could not load sales_data.csv')
        return res.text()
      })
      .then(csvText => {
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        })
        setRawCount(parsed.data.length)
        const { cleanRows, issueLog } = cleanData(parsed.data)
        setAllRows(cleanRows)
        setIssueLog(issueLog)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    writeFiltersToURL(filters)
  }, [filters])

  const categories = useMemo(() => {
    const set = new Set(allRows.map(r => r.category))
    return [...set].sort()
  }, [allRows])

  const regions = useMemo(() => {
    const set = new Set(allRows.map(r => r.region))
    return [...set].sort()
  }, [allRows])

  const filtered = useMemo(() => {
    return allRows.filter(row => {
      if (filters.category !== 'All' && row.category !== filters.category) return false
      if (filters.region   !== 'All' && row.region   !== filters.region)   return false
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom)
        if (row.date < from) return false
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo)
        to.setHours(23, 59, 59)
        if (row.date > to) return false
      }
      return true
    })
  }, [allRows, filters])

  const totalRevenue = useMemo(
    () => filtered.reduce((s, r) => s + r.revenue, 0),
    [filtered]
  )
  const totalOrders = filtered.length
  const avgRating = useMemo(() => {
    const rated = filtered.filter(r => r.rating !== null)
    if (!rated.length) return '—'
    const avg = rated.reduce((s, r) => s + r.rating, 0) / rated.length
    return avg.toFixed(2)
  }, [filtered])
  const totalUnits = useMemo(
    () => filtered.reduce((s, r) => s + r.quantity, 0),
    [filtered]
  )

  // Revenue by category (for bar chart)
  const categoryData = useMemo(() => {
    const map = {}
    filtered.forEach(r => {
      map[r.category] = (map[r.category] || 0) + r.revenue
    })
    return Object.entries(map)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [filtered])

  // Revenue by month (for line chart)
  const monthlyData = useMemo(() => {
    const map = {}
    filtered.forEach(r => {
      map[r.month] = (map[r.month] || 0) + r.revenue
    })
    return Object.entries(map)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [filtered])

  // Revenue by region (for pie chart)
  const regionData = useMemo(() => {
    const map = {}
    filtered.forEach(r => {
      map[r.region] = (map[r.region] || 0) + r.revenue
    })
    return Object.entries(map)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [filtered])

  // Top 5 products by revenue
  const topProducts = useMemo(() => {
    const map = {}
    filtered.forEach(r => {
      if (!map[r.product]) map[r.product] = { name: r.product, revenue: 0, orders: 0 }
      map[r.product].revenue += r.revenue
      map[r.product].orders  += 1
    })
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [filtered])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading and cleaning sales data…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    )
  }

  return (
    <>
      <nav className="app-navbar">
        <div className="brand">
          <i className="bi bi-graph-up-arrow"></i>
          Sales Dashboard
        </div>
        <span className="sub">{totalOrders} orders after cleaning</span>
      </nav>

      <div className="dashboard-wrap">
        <DataQualityPanel
          issueLog={issueLog}
          totalRaw={rawCount}
          totalClean={allRows.length}
        />
        <Filters
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          regions={regions}
        />

        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <StatCard
              label="Total Revenue"
              value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
              icon="bi-currency-rupee"
              bgColor="#e8edff"
              iconColor="#4361ee"
            />
          </div>
          
          <div className="col-6 col-md-3">
            <StatCard
              label="Total Orders"
              value={totalOrders.toLocaleString('en-IN')}
              icon="bi-bag-check"
              bgColor="#fce4ec"
              iconColor="#f72585"
            />
          </div>

          <div className="col-6 col-md-3">
            <StatCard
              label="Units Sold"
              value={totalUnits.toLocaleString('en-IN')}
              icon="bi-box-seam"
              bgColor="#e0f7fa"
              iconColor="#00b4d8"
            />
          </div>
          <div className="col-6 col-md-3">
            <StatCard
              label="Avg Rating"
              value={avgRating}
              icon="bi-star-half"
              bgColor="#fff8e1"
              iconColor="#ffc107"
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-6">
            <div className="chart-card h-100">
              <div className="chart-title">
                <i className="bi bi-bar-chart-fill me-2 text-primary"></i>
                Revenue by Category
              </div>
              <RevenueBarChart data={categoryData} />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="chart-card h-100">
              <div className="chart-title">
                <i className="bi bi-graph-up me-2 text-primary"></i>
                Monthly Revenue Trend
              </div>
              <MonthlyLineChart data={monthlyData} />
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-5">
            <div className="chart-card h-100">
              <div className="chart-title">
                <i className="bi bi-pie-chart-fill me-2 text-primary"></i>
                Revenue by Region
              </div>
              <CategoryPieChart data={regionData} />
            </div>
          </div>
          <div className="col-12 col-lg-7">
            <div className="chart-card h-100">
              <div className="chart-title">
                <i className="bi bi-trophy me-2 text-primary"></i>
                Top 5 Products by Revenue
              </div>
              <TopProductsTable data={topProducts} />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
