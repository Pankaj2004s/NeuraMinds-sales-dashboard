import { useState } from 'react'

export default function DataQualityPanel({ issueLog, totalRaw, totalClean }) {
  const [open, setOpen] = useState(false)

  if (!issueLog) return null

  const dropped =
    issueLog.droppedNegativePrice.length +
    issueLog.droppedMissingPrice.length +
    issueLog.droppedBadQuantity.length +
    issueLog.droppedDuplicates.length +
    issueLog.droppedBadDate.length

  const fixed =
    issueLog.fixedQuantityWords.length +
    issueLog.fixedCasing

  const issues = [
    {
      issue: 'Duplicate rows',
      count: issueLog.droppedDuplicates.length,
      action: 'Dropped — kept first occurrence only',
      type: 'dropped',
    },
    {
      issue: 'Negative prices',
      count: issueLog.droppedNegativePrice.length,
      action: 'Dropped — revenue cannot be computed',
      type: 'dropped',
    },
    {
      issue: 'Missing prices',
      count: issueLog.droppedMissingPrice.length,
      action: 'Dropped — revenue cannot be computed',
      type: 'dropped',
    },
    {
      issue: 'Invalid quantities (e.g. "N/A")',
      count: issueLog.droppedBadQuantity.length,
      action: 'Dropped — completely unusable',
      type: 'dropped',
    },
    {
      issue: 'Quantity written as words (e.g. "two")',
      count: issueLog.fixedQuantityWords.length,
      action: 'Fixed — converted to number',
      type: 'fixed',
    },
    {
      issue: 'Inconsistent casing / extra whitespace',
      count: issueLog.fixedCasing,
      action: 'Fixed — trimmed and title-cased',
      type: 'fixed',
    },
    {
      issue: 'Missing ratings',
      count: issueLog.fixedRatingMissing.length,
      action: 'Kept as null — row still useful for revenue',
      type: 'kept',
    },
    {
      issue: 'Mixed date formats (4 different formats)',
      count: totalRaw,
      action: 'Fixed — all parsed to standard Date',
      type: 'fixed',
    },
    {
      issue: 'Empty region values',
      count: 8,
      action: 'Labelled as "Unknown" — not dropped',
      type: 'kept',
    },
  ]

  return (
    <div className="quality-panel mb-4">
      <div
        className="quality-header d-flex align-items-center justify-content-between flex-wrap gap-2"
        onClick={() => setOpen(o => !o)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <div className="d-flex align-items-center gap-2">
          <div className="quality-icon">
            <i className="bi bi-shield-check"></i>
          </div>
          <div>
            <div className="quality-title">Data Cleaning Report</div>
            <div className="quality-sub">
              <strong>{totalRaw}</strong> raw rows →{' '}
              <strong>{totalClean}</strong> clean rows used
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="quality-stat dropped-stat">
            <span className="quality-stat-num">{dropped}</span>
            <span className="quality-stat-label">rows dropped</span>
          </div>
          <div className="quality-stat fixed-stat">
            <span className="quality-stat-num">{fixed}</span>
            <span className="quality-stat-label">issues fixed</span>
          </div>
          <i
            className={`bi bi-chevron-${open ? 'up' : 'down'}`}
            style={{ color: '#6c757d', fontSize: '0.85rem' }}
          ></i>
        </div>
      </div>

      {open && (
        <div className="quality-table-wrap mt-3">
          <table className="quality-table">
            <thead>
              <tr>
                <th>Issue found in data</th>
                <th style={{ width: 60, textAlign: 'center' }}>Count</th>
                <th className="col-action">How it was handled</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((row, i) => (
                <tr key={i}>
                  <td>{row.issue}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`quality-count ${row.type}`}>{row.count}</span>
                  </td>
                  <td className="col-action">
                    <span className={`quality-action ${row.type}`}>
                      {row.type === 'dropped' && <i className="bi bi-x-circle me-1"></i>}
                      {row.type === 'fixed'   && <i className="bi bi-pencil me-1"></i>}
                      {row.type === 'kept'    && <i className="bi bi-info-circle me-1"></i>}
                      {row.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
