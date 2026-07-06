export function readFiltersFromURL() {
  const params = new URLSearchParams(window.location.search)
  return {
    category:  params.get('category')  || 'All',
    region:    params.get('region')    || 'All',
    dateFrom:  params.get('dateFrom')  || '',
    dateTo:    params.get('dateTo')    || '',
  }
}

export function writeFiltersToURL(filters) {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'All') params.set('category', filters.category)
  if (filters.region   && filters.region   !== 'All') params.set('region',   filters.region)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo)   params.set('dateTo',   filters.dateTo)

  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname

  window.history.replaceState(null, '', newURL)
}
