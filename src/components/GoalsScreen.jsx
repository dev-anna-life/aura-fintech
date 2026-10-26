import React, { useState } from 'react'
import CreateGoalModal from './CreateGoalModal'
import ContributeGoalModal from './ContributeGoalModal'

export default function GoalsScreen({
  goals = [],
  balance = 0,
  currency = 'NGN',
  onCreateGoal,
  onContributeGoal,
  onDeleteGoal
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeGoalToFund, setActiveGoalToFund] = useState(null)

  const isUSD = currency === 'USD'
  const exchangeRate = 1625
  const currencySymbol = isUSD ? '$' : '₦'

  const totalSavedNgn = goals.reduce((sum, g) => sum + (Number(g.savedNgn) || 0), 0)
  const totalTargetNgn = goals.reduce((sum, g) => sum + (Number(g.targetNgn) || 0), 0)
  const totalMonthlyCommitmentNgn = goals.reduce((sum, g) => {
    const isCompleted = Number(g.savedNgn) >= Number(g.targetNgn)
    return sum + (isCompleted ? 0 : (Number(g.monthlyCommitmentNgn) || 15000))
  }, 0)

  const displayTotalSaved = isUSD ? totalSavedNgn / exchangeRate : totalSavedNgn
  const displayTotalTarget = isUSD ? totalTargetNgn / exchangeRate : totalTargetNgn
  const displayMonthlyCommitment = isUSD ? totalMonthlyCommitmentNgn / exchangeRate : totalMonthlyCommitmentNgn

  const overallPercent = totalTargetNgn > 0
    ? Math.min(100, Math.round((totalSavedNgn / totalTargetNgn) * 100))
    : 0

  return (
    <div style={{ padding: '14px 18px 88px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>
            Savings Goals
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500', marginTop: '2px' }}>
            Turn everyday discipline into long-term wealth
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="tap-spring"
          style={{
            background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
            border: 'none',
            borderRadius: '14px',
            padding: '9px 14px',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 14px rgba(0, 168, 132, 0.25)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Goal
        </button>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0B3D2E 0%, #0F2D24 100%)',
          borderRadius: '24px',
          padding: '20px 18px',
          color: '#ffffff',
          boxShadow: '0 12px 30px rgba(11, 61, 46, 0.2)',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 168, 132, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Accumulated Goal Wealth
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '2px', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {currencySymbol}{displayTotalSaved.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: '600', marginTop: '2px' }}>
              Target: {currencySymbol}{displayTotalTarget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} across {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(0, 168, 132, 0.25)',
              border: '1px solid rgba(0, 168, 132, 0.45)',
              borderRadius: '14px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '800',
              color: '#00A884'
            }}
          >
            {overallPercent}% Achieved
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${overallPercent}%`,
                background: 'linear-gradient(90deg, #00A884, #10B981)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: '600' }}>
              Protected in Safe-to-Spend
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#00A884', marginTop: '1px' }}>
              {currencySymbol}{displayMonthlyCommitment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / month
            </div>
          </div>

          <div
            style={{
              fontSize: '10px',
              color: '#00A884',
              fontWeight: '700',
              background: 'rgba(0, 168, 132, 0.14)',
              padding: '4px 10px',
              borderRadius: '10px'
            }}
          >
            Auto-Synced with Home
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map(goal => {
          const savedVal = isUSD ? goal.savedNgn / exchangeRate : goal.savedNgn
          const targetVal = isUSD ? goal.targetNgn / exchangeRate : goal.targetNgn
          const remainingVal = Math.max(0, targetVal - savedVal)
          const pct = targetVal > 0 ? Math.min(100, Math.round((savedVal / targetVal) * 100)) : 0
          const isCompleted = pct >= 100
          const weeklySuggested = (isUSD ? (goal.monthlyCommitmentNgn || 20000) / exchangeRate : (goal.monthlyCommitmentNgn || 20000)) / 4.33
          const weeksLeft = weeklySuggested > 0 ? Math.max(1, Math.ceil(remainingVal / weeklySuggested)) : 0

          return (
            <div
              key={goal.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0, 168, 132, 0.16)',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '0 4px 14px rgba(11, 61, 46, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(0, 168, 132, 0.1)',
                      border: '1px solid rgba(0, 168, 132, 0.28)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800',
                      color: '#0B3D2E',
                      flexShrink: 0
                    }}
                  >
                    {goal.icon || 'GL'}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F1F1B' }}>
                      {goal.title || goal.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500', marginTop: '1px' }}>
                      Target Date: {goal.deadline || 'Dec 2026'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      background: isCompleted ? 'rgba(0, 168, 132, 0.15)' : '#F8FAF7',
                      border: isCompleted ? '1px solid rgba(0, 168, 132, 0.35)' : '1px solid rgba(0, 168, 132, 0.15)',
                      borderRadius: '10px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: isCompleted ? '#00A884' : '#0B3D2E'
                    }}
                  >
                    {pct}%
                  </div>
                  {goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteGoal && onDeleteGoal(goal.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        fontSize: '15px',
                        padding: '2px 4px',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#0B3D2E', fontVariantNumeric: 'tabular-nums' }}>
                    {currencySymbol}{savedVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>
                      {' '}of {currencySymbol}{targetVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: isCompleted ? '#00A884' : '#64748B' }}>
                    {isCompleted ? 'Goal Reached' : `${currencySymbol}${remainingVal.toLocaleString(undefined, { maximumFractionDigits: 0 })} to go`}
                  </div>
                </div>

                <div style={{ height: '7px', background: '#F1F5F2', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: isCompleted
                        ? '#00A884'
                        : 'linear-gradient(90deg, #0B3D2E, #00A884)',
                      borderRadius: '4px',
                      transition: 'width 0.35s ease'
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(0, 168, 132, 0.1)'
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                  {isCompleted ? (
                    <span style={{ color: '#00A884', fontWeight: '700' }}>Target 100% funded</span>
                  ) : (
                    <>
                      Pace:{' '}
                      <span style={{ color: '#0F1F1B', fontWeight: '800' }}>
                        {currencySymbol}{weeklySuggested.toLocaleString(undefined, { maximumFractionDigits: 0 })}/wk
                      </span>
                      <span style={{ color: '#00A884', fontWeight: '700', marginLeft: '5px' }}>
                        ({weeksLeft} {weeksLeft === 1 ? 'wk' : 'wks'} left)
                      </span>
                    </>
                  )}
                </div>

                {isCompleted ? (
                  <div
                    style={{
                      background: 'rgba(0, 168, 132, 0.14)',
                      border: '1px solid rgba(0, 168, 132, 0.35)',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      color: '#00A884',
                      fontSize: '11px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Goal Achieved
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveGoalToFund(goal)}
                    className="tap-spring"
                    style={{
                      background: 'rgba(0, 168, 132, 0.1)',
                      border: '1px solid rgba(0, 168, 132, 0.3)',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      color: '#00A884',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Log Savings
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showCreateModal && (
        <CreateGoalModal
          currency={currency}
          onCreateGoal={onCreateGoal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {activeGoalToFund && (
        <ContributeGoalModal
          goal={activeGoalToFund}
          balance={balance}
          currency={currency}
          onContribute={onContributeGoal}
          onClose={() => setActiveGoalToFund(null)}
        />
      )}
    </div>
  )
}
