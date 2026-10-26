import React from 'react'

export default function HeroBalanceCard({
  balance,
  hidden,
  setHidden,
  currency = 'NGN',
  onToggleCurrency
}) {
  const ngnAmount = currency === 'NGN'
    ? (balance ? (balance * 160).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '1,250,000.00')
    : (balance ? balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '12,480.87')

  const currencySymbol = currency === 'NGN' ? '₦' : '$'

  return (
    <div
      style={{
        width: '100%',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #0B3D2E 0%, #08291F 60%, #041712 100%)',
        border: '1px solid rgba(0, 168, 132, 0.35)',
        boxShadow: '0 12px 30px rgba(11, 61, 46, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        padding: '22px 20px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          right: '-20px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 168, 132, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(248, 250, 247, 0.75)', letterSpacing: '0.01em' }}>
            Total balance
          </span>
          <button
            onClick={() => setHidden(h => !h)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(248, 250, 247, 0.6)',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {hidden ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

        {onToggleCurrency && (
          <button
            onClick={onToggleCurrency}
            className="tap-spring"
            style={{
              background: 'rgba(0, 168, 132, 0.15)',
              border: '1px solid rgba(0, 168, 132, 0.3)',
              borderRadius: '10px',
              padding: '2px 8px',
              color: '#00A884',
              fontSize: '10px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            {currency === 'NGN' ? '₦ NGN' : '$ USD'}
          </button>
        )}
      </div>

      <div style={{
        fontSize: '28px',
        fontWeight: '900',
        color: '#F8FAF7',
        letterSpacing: '-0.03em',
        fontVariantNumeric: 'tabular-nums',
        marginBottom: '16px'
      }}>
        {hidden ? '••••••••' : `${currencySymbol}${ngnAmount}`}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00A884', fontSize: '12px', fontWeight: '800' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 4 4 20 20 20" />
            </svg>
            <span>+12.5%</span>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(248, 250, 247, 0.55)', fontWeight: '500', marginTop: '2px' }}>
            vs last month
          </div>
        </div>

        <div style={{ width: '130px', height: '42px', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 130 42" fill="none">
            <defs>
              <linearGradient id="balanceWaveGrad" x1="0" y1="0" x2="0" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00A884" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#00A884" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="balanceWaveStroke" x1="0" y1="20" x2="130" y2="10" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0B3D2E" />
                <stop offset="40%" stopColor="#00A884" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            <path
              d="M 2 34 Q 30 36 55 24 T 100 18 T 128 6 L 128 42 L 2 42 Z"
              fill="url(#balanceWaveGrad)"
            />

            <path
              d="M 2 34 Q 30 36 55 24 T 100 18 T 128 6"
              stroke="url(#balanceWaveStroke)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle cx="128" cy="6" r="3" fill="#10B981" />
            <circle cx="128" cy="6" r="6" fill="#10B981" fillOpacity="0.3" />
          </svg>
        </div>
      </div>
    </div>
  )
}
