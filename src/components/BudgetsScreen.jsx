import React, { useState } from 'react'
import SetBudgetLimitModal from './SetBudgetLimitModal'

const DEFAULT_CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', color: '#f59e0b', icon: 'FD' },
  { id: 'Transport', label: 'Transport', color: '#0284c7', icon: 'TR' },
  { id: 'Bills', label: 'Bills & Utilities', color: '#6366f1', icon: 'BU' },
  { id: 'Shopping', label: 'Shopping', color: '#f43f5e', icon: 'SH' },
  { id: 'Subscription', label: 'Subscriptions', color: '#8b5cf6', icon: 'SB' },
  { id: 'Health', label: 'Health', color: '#00A884', icon: 'HL' },
  { id: 'Other', label: 'Other', color: '#64748b', icon: 'OT' }
]

export default function BudgetsScreen({
  transactions = [],
  budgets = {},
  thresholds = {},
  currency = 'NGN',
  onUpdateBudget,
  onClose
}) {
  const [editingCategory, setEditingCategory] = useState(null)
  const isUSD = currency === 'USD'
  const exchangeRate = 160
  const currencySymbol = isUSD ? '$' : '₦'

  const spendingByCategory = {}
  DEFAULT_CATEGORIES.forEach(c => {
    spendingByCategory[c.id] = 0
  })

  transactions
    .filter(t => Number(t.amount) < 0)
    .forEach(t => {
      const cat = t.category || 'Other'
      const matched = DEFAULT_CATEGORIES.find(c => c.id === cat || c.label.toLowerCase().includes(cat.toLowerCase()))
      const catId = matched ? matched.id : 'Other'
      const rawAmt = Math.abs(Number(t.amount))
      const normAmt = t.currency === 'USD' ? (isUSD ? rawAmt : rawAmt * exchangeRate) : (isUSD ? rawAmt / exchangeRate : rawAmt)
      spendingByCategory[catId] = (spendingByCategory[catId] || 0) + normAmt
    })

  const totalBudget = DEFAULT_CATEGORIES.reduce((sum, c) => {
    const limit = budgets[c.id] || (isUSD ? 40 : 60000)
    return sum + limit
  }, 0)

  const totalSpent = Object.values(spendingByCategory).reduce((sum, val) => sum + val, 0)
  const totalRemaining = Math.max(0, totalBudget - totalSpent)
  const overallPercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0

  const alerts = DEFAULT_CATEGORIES.map(c => {
    const spent = spendingByCategory[c.id] || 0
    const limit = budgets[c.id] || (isUSD ? 40 : 60000)
    const thresholdPct = (thresholds && thresholds[c.id]) !== undefined ? thresholds[c.id] : 75
    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0
    const triggerAmt = Math.round(limit * (thresholdPct / 100))
    const isTriggered = pct >= thresholdPct
    const isOver = spent > limit
    return {
      ...c,
      spent,
      limit,
      thresholdPct,
      pct,
      triggerAmt,
      isTriggered,
      isOver
    }
  }).filter(c => c.isTriggered)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#F8FAF7',
        position: 'relative',
        overflowY: 'auto',
        scrollbarWidth: 'none'
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0, 168, 132, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>
            Budgets & Guardrails
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
            Dynamic category caps & custom alert triggers
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: '#F1F5F2',
            border: '1px solid rgba(0, 168, 132, 0.15)',
            borderRadius: '12px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            color: '#0F1F1B',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '16px 18px 90px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Monthly Budget Health Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B3D2E 0%, #0F2D24 100%)',
            borderRadius: '24px',
            padding: '20px 18px',
            color: '#ffffff',
            boxShadow: '0 12px 30px rgba(11, 61, 46, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Monthly Budget Health
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                {currencySymbol}{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '600' }}>
                  {' '}/ {currencySymbol}{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            <div
              style={{
                background: overallPercent > 90 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 168, 132, 0.25)',
                border: overallPercent > 90 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(0, 168, 132, 0.4)',
                borderRadius: '14px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '800',
                color: overallPercent > 90 ? '#fca5a5' : '#00A884'
              }}
            >
              {overallPercent}% Used
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${overallPercent}%`,
                  background: overallPercent > 90
                    ? '#EF4444'
                    : overallPercent > 70
                    ? '#F59E0B'
                    : '#00A884',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '600' }}>Total Remaining</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#00A884', marginTop: '2px' }}>
                {currencySymbol}{totalRemaining.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '600' }}>Guardrail Status</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: overallPercent > 90 ? '#EF4444' : alerts.length > 0 ? '#F59E0B' : '#00A884', marginTop: '2px' }}>
                {overallPercent > 90 ? 'Limit Exceeded' : alerts.length > 0 ? `${alerts.length} Alert Active` : 'Disciplined'}
              </div>
            </div>
          </div>
        </div>

        {/* Active Guardrail Alerts Banner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F1F1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Guardrail Radar
            </div>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
              Custom Thresholds
            </span>
          </div>

          {alerts.length > 0 ? (
            alerts.map(a => (
              <div
                key={a.id}
                style={{
                  background: a.isOver ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                  border: a.isOver ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: a.isOver ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0
                  }}
                >
                  {a.isOver ? '🚨' : '⚠️'}
                </div>
                <div style={{ flex: 1, fontSize: '11px', color: '#0F1F1B', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: '800', fontSize: '12px', color: a.isOver ? '#DC2626' : '#B45309' }}>
                    {a.label} {a.isOver ? 'Exceeded Budget Limit' : `Crossed Custom ${a.thresholdPct}% Threshold`}
                  </div>
                  <div style={{ color: '#64748B', marginTop: '2px', fontSize: '10px' }}>
                    Spent <span style={{ fontWeight: '700', color: '#0F1F1B' }}>{currencySymbol}{a.spent.toLocaleString()}</span> of {currencySymbol}{a.limit.toLocaleString()} ({a.pct}%)
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                background: 'rgba(0, 168, 132, 0.06)',
                border: '1px solid rgba(0, 168, 132, 0.2)',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div style={{ fontSize: '14px' }}>🛡️</div>
              <div style={{ fontSize: '11px', color: '#0B3D2E', fontWeight: '600' }}>
                All category spending is well within your custom alert thresholds. Safe-to-Spend remains fully guarded.
              </div>
            </div>
          )}
        </div>

        {/* Category List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F1F1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Category Guardrails
            </div>
            <span style={{ fontSize: '10px', color: '#00A884', fontWeight: '700' }}>
              Tap category to configure
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DEFAULT_CATEGORIES.map(cat => {
              const spent = spendingByCategory[cat.id] || 0
              const limit = budgets[cat.id] || (isUSD ? 40 : 60000)
              const thresholdPct = (thresholds && thresholds[cat.id]) !== undefined ? thresholds[cat.id] : 75
              const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0
              const remaining = Math.max(0, limit - spent)
              const isOver = spent > limit
              const isThresholdCrossed = pct >= thresholdPct
              const triggerAmt = Math.round(limit * (thresholdPct / 100))

              return (
                <div
                  key={cat.id}
                  onClick={() => setEditingCategory(cat)}
                  className="tap-spring"
                  style={{
                    background: '#FFFFFF',
                    border: isOver
                      ? '1px solid rgba(239, 68, 68, 0.35)'
                      : isThresholdCrossed
                      ? '1px solid rgba(245, 158, 11, 0.35)'
                      : '1px solid rgba(0, 168, 132, 0.14)',
                    borderRadius: '18px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: `${cat.color}15`,
                          border: `1px solid ${cat.color}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '800',
                          color: cat.color
                        }}
                      >
                        {cat.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F1F1B' }}>
                            {cat.label}
                          </span>
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: '700',
                              padding: '2px 6px',
                              borderRadius: '6px',
                              background: isOver
                                ? 'rgba(239, 68, 68, 0.12)'
                                : isThresholdCrossed
                                ? 'rgba(245, 158, 11, 0.12)'
                                : 'rgba(0, 168, 132, 0.1)',
                              color: isOver
                                ? '#DC2626'
                                : isThresholdCrossed
                                ? '#D97706'
                                : '#00A884'
                            }}
                          >
                            🔔 {thresholdPct}% alert
                          </span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748B', marginTop: '1px' }}>
                          Cap: {currencySymbol}{limit.toLocaleString()} · Alert at {currencySymbol}{triggerAmt.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: isOver ? '#DC2626' : '#0F1F1B', fontVariantNumeric: 'tabular-nums' }}>
                        {currencySymbol}{spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: isOver ? '#DC2626' : '#00A884', marginTop: '1px' }}>
                        {isOver ? `Over by ${currencySymbol}${(spent - limit).toLocaleString()}` : `${currencySymbol}${remaining.toLocaleString()} left`}
                      </div>
                    </div>
                  </div>

                  {/* Visual Tripwire Progress Track */}
                  <div style={{ position: 'relative', marginTop: '2px' }}>
                    <div style={{ height: '7px', background: '#F1F5F2', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: isOver
                            ? '#EF4444'
                            : isThresholdCrossed
                            ? '#F59E0B'
                            : cat.color || '#00A884',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    {/* Tripwire Notch Marker */}
                    <div
                      title={`Alert trigger: ${thresholdPct}%`}
                      style={{
                        position: 'absolute',
                        top: '-2px',
                        left: `${thresholdPct}%`,
                        width: '2px',
                        height: '11px',
                        background: '#0F1F1B',
                        borderRadius: '1px',
                        opacity: 0.45,
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {editingCategory && (
        <SetBudgetLimitModal
          categories={DEFAULT_CATEGORIES}
          initialCategory={editingCategory}
          currentBudgets={budgets}
          currentThresholds={thresholds}
          currency={currency}
          onSaveLimit={(catId, newLimit, newThreshold) => {
            onUpdateBudget(catId, newLimit, newThreshold)
          }}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  )
}
