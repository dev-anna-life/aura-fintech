import React, { useState } from 'react'

export default function SafeToSpendCard({
  balance,
  currency = 'NGN',
  transactions = [],
  budgets = {},
  committedBills = 45000,
  committedSavings = 25000,
  onOpenBudgets
}) {
  const [expanded, setExpanded] = useState(false)

  const isUSD = currency === 'USD'
  const exchangeRate = 160

  const totalBalanceNgn = balance ? balance * exchangeRate : 1250000
  const billsNgn = committedBills
  const savingsNgn = committedSavings

  const totalSpentNgn = transactions
    .filter(t => Number(t.amount) < 0)
    .reduce((sum, t) => {
      const amt = Math.abs(Number(t.amount))
      return sum + (t.currency === 'USD' ? amt * exchangeRate : amt)
    }, 0)

  const rawSafeNgn = Math.max(0, totalBalanceNgn - billsNgn - savingsNgn)
  const displaySafe = isUSD ? rawSafeNgn / exchangeRate : rawSafeNgn
  const currencySymbol = isUSD ? '$' : '₦'

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysRemaining = Math.max(1, daysInMonth - today.getDate())
  const dailyPace = displaySafe / daysRemaining

  const safePercent = totalBalanceNgn > 0
    ? Math.min(100, Math.round((rawSafeNgn / totalBalanceNgn) * 100))
    : 0

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid rgba(0, 168, 132, 0.22)',
        padding: '20px 18px',
        boxShadow: '0 8px 24px rgba(11, 61, 46, 0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 168, 132, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00A884',
              boxShadow: '0 0 10px rgba(0, 168, 132, 0.8)'
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#0B3D2E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Aura Safe-To-Spend
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          style={{
            background: 'rgba(0, 168, 132, 0.08)',
            border: '1px solid rgba(0, 168, 132, 0.2)',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#00A884',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{expanded ? 'Hide Breakdown' : 'Why this amount?'}</span>
          <svg
            width="12"
            height="12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '32px', fontWeight: '900', color: '#0B3D2E', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          {currencySymbol}{displaySafe.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
            Safe daily pace:
          </div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#00A884' }}>
            {currencySymbol}{dailyPace.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / day
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>
            ({daysRemaining} days left)
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Uncommitted Liquidity
          </span>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#0B3D2E' }}>
            {safePercent}% of Balance
          </span>
        </div>
        <div style={{ height: '7px', background: '#F1F5F2', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${safePercent}%`,
              background: 'linear-gradient(90deg, #0B3D2E, #00A884)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {expanded && (
        <div
          style={{
            marginTop: '14px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(0, 168, 132, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F1F1B', marginBottom: '2px' }}>
            Financial Reality Calculation
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAF7', borderRadius: '12px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Total Liquid Balance</span>
            <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '800' }}>
              +{currencySymbol}{(isUSD ? totalBalanceNgn / exchangeRate : totalBalanceNgn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAF7', borderRadius: '12px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Committed Essential Bills</span>
            <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: '800' }}>
              -{currencySymbol}{(isUSD ? billsNgn / exchangeRate : billsNgn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAF7', borderRadius: '12px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Active Savings Commitments</span>
            <span style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '800' }}>
              -{currencySymbol}{(isUSD ? savingsNgn / exchangeRate : savingsNgn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 12px',
            background: 'rgba(0, 168, 132, 0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 168, 132, 0.25)',
            marginTop: '2px'
          }}>
            <span style={{ fontSize: '11px', color: '#0B3D2E', fontWeight: '800' }}>True Safe-to-Spend</span>
            <span style={{ fontSize: '12px', color: '#00A884', fontWeight: '900' }}>
              ={currencySymbol}{displaySafe.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div style={{ fontSize: '10px', color: '#64748B', lineHeight: '1.45', marginTop: '4px' }}>
            Aura reserves money for your rent, utilities, and savings before you spend it, so you never get stranded before payday.
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
        <button
          type="button"
          onClick={onOpenBudgets}
          className="tap-spring"
          style={{
            flex: 1,
            height: '38px',
            borderRadius: '12px',
            background: '#F8FAF7',
            border: '1.5px solid rgba(0, 168, 132, 0.25)',
            color: '#0B3D2E',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#00A884" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 10 10h-10z" fill="rgba(0, 168, 132, 0.3)" />
          </svg>
          Manage Spending Limits
        </button>
      </div>
    </div>
  )
}
