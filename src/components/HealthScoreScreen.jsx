import React, { useState } from 'react'

export default function HealthScoreScreen({
  transactions = [],
  budgets = {},
  goals = [],
  balance = 0,
  committedBills = 45000,
  committedSavings = 25000,
  currency = 'NGN',
  onClose
}) {
  const isUSD = currency === 'USD'
  const exchangeRate = 160
  const currencySymbol = isUSD ? '$' : '₦'

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
  const safeRatio = totalBalanceNgn > 0 ? (rawSafeNgn / totalBalanceNgn) : 0

  let liquidityScore = 0
  if (safeRatio >= 0.3) {
    liquidityScore = 25
  } else if (safeRatio >= 0.15) {
    liquidityScore = 18
  } else if (safeRatio > 0) {
    liquidityScore = 10
  } else {
    liquidityScore = 0
  }

  const defaultCategories = ['Food', 'Transport', 'Bills', 'Shopping', 'Subscription', 'Health', 'Other']
  const spendingByCategory = {}
  defaultCategories.forEach(c => { spendingByCategory[c] = 0 })

  transactions
    .filter(t => Number(t.amount) < 0)
    .forEach(t => {
      const cat = t.category || 'Other'
      const matched = defaultCategories.find(c => c.toLowerCase() === cat.toLowerCase() || cat.toLowerCase().includes(c.toLowerCase()))
      const catKey = matched || 'Other'
      const rawAmt = Math.abs(Number(t.amount))
      const amtNgn = t.currency === 'USD' ? rawAmt * exchangeRate : rawAmt
      spendingByCategory[catKey] = (spendingByCategory[catKey] || 0) + amtNgn
    })

  let overBudgetCount = 0
  let nearBudgetCount = 0

  defaultCategories.forEach(c => {
    const limit = budgets[c] || 45000
    const spent = spendingByCategory[c] || 0
    if (spent >= limit) {
      overBudgetCount += 1
    } else if (spent >= limit * 0.8) {
      nearBudgetCount += 1
    }
  })

  let budgetScore = Math.max(5, 40 - (overBudgetCount * 12) - (nearBudgetCount * 5))

  const totalGoals = goals.length
  const completedGoals = goals.filter(g => Number(g.savedNgn) >= Number(g.targetNgn)).length
  const totalSavedAcrossGoals = goals.reduce((s, g) => s + (Number(g.savedNgn) || 0), 0)
  const totalTargetAcrossGoals = goals.reduce((s, g) => s + (Number(g.targetNgn) || 1), 0)
  const overallGoalRatio = totalTargetAcrossGoals > 0 ? (totalSavedAcrossGoals / totalTargetAcrossGoals) : 0

  let goalScore = Math.min(35, Math.round(overallGoalRatio * 25) + (totalGoals > 0 ? 10 : 0))

  const totalScore = Math.min(100, Math.max(10, liquidityScore + budgetScore + goalScore))

  let tierLabel = 'Sovereign Wealth Health'
  let tierColor = '#00A884'
  let tierDesc = 'Your uncommitted liquidity, category spending limits, and long-term goal pace are completely aligned.'

  if (totalScore >= 85) {
    tierLabel = 'Sovereign Wealth Health'
    tierColor = '#00A884'
    tierDesc = 'Elite financial discipline. Rent, essential bills, and savings commitments are shielded from daily impulses.'
  } else if (totalScore >= 70) {
    tierLabel = 'Resilient Health'
    tierColor = '#00A884'
    tierDesc = 'Solid financial balance. Keep category spending under 80% to accelerate goal completion velocity.'
  } else if (totalScore >= 50) {
    tierLabel = 'Moderate Exposure'
    tierColor = '#D97706'
    tierDesc = 'Caution required. Spending is encroaching on your Safe-to-Spend boundary. Restrict flexible expenses.'
  } else {
    tierLabel = 'High Fragility'
    tierColor = '#DC2626'
    tierDesc = 'Emergency rebalancing needed. Daily spending is depleting committed funds needed for upcoming bills.'
  }

  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#F8FAF7',
      zIndex: 110,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <div style={{
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(0, 168, 132, 0.14)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onClose}
            className="tap-spring"
            style={{
              background: 'rgba(0, 168, 132, 0.1)',
              border: 'none',
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0B3D2E'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>
              Financial Health Score
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
              Weekly Sovereign Reality Check
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 168, 132, 0.12)',
          border: '1px solid rgba(0, 168, 132, 0.3)',
          borderRadius: '12px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: '800',
          color: '#00A884'
        }}>
          Live Diagnostic
        </div>
      </div>

      <div style={{ padding: '18px 18px 90px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0B3D2E 0%, #041712 100%)',
          borderRadius: '26px',
          padding: '24px 20px',
          color: '#FFFFFF',
          boxShadow: '0 16px 36px rgba(11, 61, 46, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 168, 132, 0.28) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.65)' }}>
                Overall Financial Health
              </div>
              <div style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
                {totalScore}
                <span style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.55)', marginLeft: '4px' }}>
                  / 100
                </span>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 168, 132, 0.22)',
              border: '1px solid rgba(0, 168, 132, 0.45)',
              borderRadius: '14px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: '800',
              color: '#00A884',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00A884' }} />
              {tierLabel}
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${totalScore}%`,
                background: 'linear-gradient(90deg, #00A884, #10B981)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: '1.5',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {tierDesc}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.01em', marginBottom: '4px' }}>
            Discipline Pillar Breakdown
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
            How your composite score is mathematically calculated
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid rgba(0, 168, 132, 0.16)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'rgba(0, 168, 132, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0B3D2E',
                  fontWeight: '800',
                  fontSize: '11px'
                }}>
                  BG
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F1F1B' }}>
                    Budget Guardrail Discipline
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
                    {overBudgetCount === 0 ? 'All categories within limits' : `${overBudgetCount} category exceeded budget`}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#0B3D2E' }}>
                {budgetScore} <span style={{ fontSize: '10px', color: '#64748B' }}>/ 40</span>
              </div>
            </div>

            <div style={{ height: '6px', background: '#F1F5F2', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(budgetScore / 40) * 100}%`,
                background: '#00A884',
                borderRadius: '3px'
              }} />
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid rgba(0, 168, 132, 0.16)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'rgba(0, 168, 132, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0B3D2E',
                  fontWeight: '800',
                  fontSize: '11px'
                }}>
                  GV
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F1F1B' }}>
                    Goal Commitment & Velocity
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
                    {totalGoals} active targets ({Math.round(overallGoalRatio * 100)}% overall completion)
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#0B3D2E' }}>
                {goalScore} <span style={{ fontSize: '10px', color: '#64748B' }}>/ 35</span>
              </div>
            </div>

            <div style={{ height: '6px', background: '#F1F5F2', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(goalScore / 35) * 100}%`,
                background: '#0B3D2E',
                borderRadius: '3px'
              }} />
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid rgba(0, 168, 132, 0.16)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'rgba(0, 168, 132, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0B3D2E',
                  fontWeight: '800',
                  fontSize: '11px'
                }}>
                  SS
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F1F1B' }}>
                    Liquidity Safety Cushion
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
                    Safe-to-Spend represents {Math.round(safeRatio * 100)}% of gross balance
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#0B3D2E' }}>
                {liquidityScore} <span style={{ fontSize: '10px', color: '#64748B' }}>/ 25</span>
              </div>
            </div>

            <div style={{ height: '6px', background: '#F1F5F2', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(liquidityScore / 25) * 100}%`,
                background: '#00A884',
                borderRadius: '3px'
              }} />
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 168, 132, 0.07)',
          border: '1.5px solid rgba(0, 168, 132, 0.25)',
          borderRadius: '20px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '6px',
              background: '#00A884',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#0B3D2E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Aura Weekly Prescriptive Action
            </span>
          </div>

          <div style={{ fontSize: '12px', color: '#0F1F1B', lineHeight: '1.5', fontWeight: '600' }}>
            Your committed rent and savings commitments are fully shielded. To maintain your Sovereign score above 85, keep weekly Food & Dining expenses under {currencySymbol}{(isUSD ? 25 : 12000).toLocaleString()} for the remaining days of the month.
          </div>
        </div>

        <button
          onClick={onClose}
          className="tap-spring"
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 168, 132, 0.25)'
          }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}
