import React from 'react'

export default function GoalsSection({ goals = [], currency = 'NGN', onViewAll, onOpenGoal }) {
  const isUSD = currency === 'USD'
  const exchangeRate = 1625
  const currencySymbol = isUSD ? '$' : '₦'

  const previewGoals = goals.slice(0, 2)

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.01em' }}>
          Your Savings Goals
        </span>
        <button
          type="button"
          onClick={onViewAll}
          style={{
            background: 'none',
            border: 'none',
            color: '#00A884',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            padding: 0
          }}
        >
          Manage goals ({goals.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {previewGoals.map(g => {
          const savedVal = isUSD ? (Number(g.savedNgn) || 0) / exchangeRate : (Number(g.savedNgn) || 0)
          const targetVal = isUSD ? (Number(g.targetNgn) || 1) / exchangeRate : (Number(g.targetNgn) || 1)
          const progress = Math.min(100, Math.round((savedVal / targetVal) * 100))

          return (
            <div
              key={g.id}
              onClick={onOpenGoal}
              className="tap-spring"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 168, 132, 0.16)',
                borderRadius: '20px',
                padding: '15px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: 'rgba(0, 168, 132, 0.1)',
                  border: '1px solid rgba(0, 168, 132, 0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#0B3D2E',
                  fontSize: '12px',
                  fontWeight: '800'
                }}
              >
                {g.icon || 'GL'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F1F1B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {g.title || g.name}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#00A884', marginLeft: '8px' }}>
                    {progress}%
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                  {currencySymbol}{savedVal.toLocaleString(undefined, { maximumFractionDigits: 0 })} / {currencySymbol}{targetVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(0, 168, 132, 0.12)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #0B3D2E, #00A884)', borderRadius: '3px', transition: 'width 0.35s ease' }} />
                </div>
              </div>

              <div style={{ color: '#94A3B8', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
