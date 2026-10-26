import React, { useState } from 'react'

export default function ContributeGoalModal({ goal, balance = 0, currency = 'NGN', onContribute, onClose }) {
  if (!goal) return null

  const isUSD = currency === 'USD'
  const exchangeRate = 160
  const currencySymbol = isUSD ? '$' : '₦'

  const mainBalanceNgn = balance ? balance * exchangeRate : 1250000
  const mainBalanceDisplay = isUSD ? mainBalanceNgn / exchangeRate : mainBalanceNgn

  const savedDisplay = isUSD ? goal.savedNgn / exchangeRate : goal.savedNgn
  const targetDisplay = isUSD ? goal.targetNgn / exchangeRate : goal.targetNgn
  const remainingDisplay = Math.max(0, targetDisplay - savedDisplay)

  const monthlyCommitmentDisplay = Math.round(
    isUSD ? (goal.monthlyCommitmentNgn || 15000) / exchangeRate : (goal.monthlyCommitmentNgn || 15000)
  )
  const weeklyPaceDisplay = Math.max(1, Math.round(monthlyCommitmentDisplay / 4.33))

  const [mode, setMode] = useState('weekly')
  const [amount, setAmount] = useState(weeklyPaceDisplay.toString())
  const [done, setDone] = useState(false)

  const numDeposit = Math.max(0, Number(amount) || 0)
  const isInsufficient = numDeposit > mainBalanceDisplay || mainBalanceDisplay <= 0
  const currentPercent = targetDisplay > 0 ? Math.min(100, Math.round((savedDisplay / targetDisplay) * 100)) : 0
  const projectedSaved = savedDisplay + numDeposit
  const projectedPercent = targetDisplay > 0 ? Math.min(100, Math.round((projectedSaved / targetDisplay) * 100)) : 0
  const projectedMainBalance = Math.max(0, mainBalanceDisplay - numDeposit)
  const weeksRemainingAfter = weeklyPaceDisplay > 0
    ? Math.max(0, Math.ceil(Math.max(0, targetDisplay - projectedSaved) / weeklyPaceDisplay))
    : 0

  function selectMode(nextMode) {
    setMode(nextMode)
    if (nextMode === 'weekly') {
      setAmount(weeklyPaceDisplay.toString())
    } else if (nextMode === 'monthly') {
      setAmount(monthlyCommitmentDisplay.toString())
    }
  }

  function handleConfirm(e) {
    if (e) e.preventDefault()
    if (numDeposit <= 0 || isInsufficient || done) return

    const depositNgn = isUSD ? numDeposit * exchangeRate : numDeposit
    setDone(true)
    onContribute(goal.id, depositNgn, numDeposit, currency)

    setTimeout(() => {
      onClose()
    }, 650)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 125,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(15, 31, 27, 0.55)',
        backdropFilter: 'blur(6px)'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="slide-up"
        style={{
          background: '#FFFFFF',
          borderRadius: '32px 32px 0 0',
          padding: '20px 18px 28px',
          border: '1px solid rgba(0, 168, 132, 0.18)',
          borderBottom: 'none',
          boxShadow: '0 -10px 40px rgba(11, 61, 46, 0.12)'
        }}
      >
        <div style={{ width: '38px', height: '4px', background: 'rgba(11, 61, 46, 0.15)', borderRadius: '2px', margin: '0 auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(0, 168, 132, 0.12)',
                border: '1px solid rgba(0, 168, 132, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '800',
                color: '#0B3D2E'
              }}
            >
              {goal.icon || 'GL'}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>
                Log Savings: {goal.title || goal.name}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
                Move money from Main Balance into this goal
              </div>
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

        <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px' }}>
            <button
              type="button"
              onClick={() => selectMode('weekly')}
              style={{
                padding: '9px 6px',
                borderRadius: '12px',
                border: mode === 'weekly' ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.15)',
                background: mode === 'weekly' ? 'rgba(0, 168, 132, 0.12)' : '#F8FAF7',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Weekly Pace</div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: mode === 'weekly' ? '#00A884' : '#0F1F1B', marginTop: '2px' }}>
                {currencySymbol}{weeklyPaceDisplay.toLocaleString()}
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectMode('monthly')}
              style={{
                padding: '9px 6px',
                borderRadius: '12px',
                border: mode === 'monthly' ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.15)',
                background: mode === 'monthly' ? 'rgba(0, 168, 132, 0.12)' : '#F8FAF7',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Monthly Hold</div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: mode === 'monthly' ? '#00A884' : '#0F1F1B', marginTop: '2px' }}>
                {currencySymbol}{monthlyCommitmentDisplay.toLocaleString()}
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectMode('custom')}
              style={{
                padding: '9px 6px',
                borderRadius: '12px',
                border: mode === 'custom' ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.15)',
                background: mode === 'custom' ? 'rgba(0, 168, 132, 0.12)' : '#F8FAF7',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Custom</div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: mode === 'custom' ? '#00A884' : '#0F1F1B', marginTop: '2px' }}>
                Any Amount
              </div>
            </button>
          </div>

          <div
            style={{
              background: '#F8FAF7',
              border: '1px solid rgba(0, 168, 132, 0.18)',
              borderRadius: '18px',
              padding: '12px 14px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              Amount to Move From Main Balance ({currencySymbol})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <span style={{ fontSize: '22px', fontWeight: '900', color: '#0B3D2E' }}>{currencySymbol}</span>
              <input
                type="number"
                value={amount}
                onChange={e => {
                  setMode('custom')
                  setAmount(e.target.value)
                }}
                min="1"
                step="any"
                required
                style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#0B3D2E',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  width: '170px',
                  textAlign: 'left',
                  fontVariantNumeric: 'tabular-nums'
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: '#F8FAF7',
              border: '1px solid rgba(0, 168, 132, 0.16)',
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>From Main Balance</span>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F1F1B', fontVariantNumeric: 'tabular-nums' }}>
                {currencySymbol}{mainBalanceDisplay.toLocaleString(undefined, { maximumFractionDigits: 0 })} →{' '}
                <span style={{ color: '#0B3D2E' }}>
                  {currencySymbol}{projectedMainBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>Into {goal.title || goal.name}</span>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#00A884', fontVariantNumeric: 'tabular-nums' }}>
                {currencySymbol}{savedDisplay.toLocaleString(undefined, { maximumFractionDigits: 0 })} →{' '}
                {currencySymbol}{projectedSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({currentPercent}% → {projectedPercent}%)
              </span>
            </div>

            <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginTop: '2px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${projectedPercent}%`,
                  background: 'linear-gradient(90deg, #0B3D2E, #00A884)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>

            <div style={{ fontSize: '10px', fontWeight: '700', color: isInsufficient ? '#DC2626' : '#00A884', textAlign: 'right' }}>
              {isInsufficient
                ? `Exceeds available balance (${currencySymbol}${mainBalanceDisplay.toLocaleString(undefined, { maximumFractionDigits: 0 })}). Record income first.`
                : projectedPercent >= 100
                  ? 'This deposit completes 100% of your goal!'
                  : `${weeksRemainingAfter} ${weeksRemainingAfter === 1 ? 'week' : 'weeks'} left at your weekly pace`}
            </div>
          </div>

          <button
            type="submit"
            disabled={numDeposit <= 0 || isInsufficient || done}
            className="tap-spring"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '16px',
              border: 'none',
              background: isInsufficient
                ? '#E2E8F0'
                : done
                  ? '#00A884'
                  : 'linear-gradient(135deg, #0B3D2E, #00A884)',
              color: isInsufficient ? '#64748B' : '#ffffff',
              fontSize: '13px',
              fontWeight: '800',
              cursor: isInsufficient ? 'not-allowed' : 'pointer',
              boxShadow: isInsufficient ? 'none' : '0 6px 20px rgba(0, 168, 132, 0.25)'
            }}
          >
            {isInsufficient
              ? 'Insufficient Main Balance'
              : done
                ? 'Saved Into Goal Vault'
                : `Move ${currencySymbol}${numDeposit.toLocaleString()} Into Goal`}
          </button>
        </form>
      </div>
    </div>
  )
}
