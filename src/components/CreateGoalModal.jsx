import React, { useState } from 'react'

const GOAL_CATEGORIES = [
  { id: 'Emergency', label: 'Emergency Cushion', icon: 'EF', color: '#00A884' },
  { id: 'Rent', label: 'Rent & Housing', icon: 'RN', color: '#0B3D2E' },
  { id: 'Tech', label: 'Laptop / Gadget', icon: 'TC', color: '#00A884' },
  { id: 'Business', label: 'Business Capital', icon: 'BZ', color: '#0B3D2E' },
  { id: 'Education', label: 'Education / Course', icon: 'ED', color: '#00A884' },
  { id: 'Travel', label: 'Travel / Relocation', icon: 'TR', color: '#0B3D2E' }
]

const DURATION_OPTIONS = [
  { months: 3, label: '3 Months' },
  { months: 6, label: '6 Months' },
  { months: 12, label: '12 Months' }
]

export default function CreateGoalModal({ currency = 'NGN', onCreateGoal, onClose }) {
  const isUSD = currency === 'USD'
  const exchangeRate = 1625
  const currencySymbol = isUSD ? '$' : '₦'

  const [selectedCat, setSelectedCat] = useState(GOAL_CATEGORIES[0])
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState(isUSD ? '500' : '300000')
  const [initialSaved, setInitialSaved] = useState('0')
  const [durationMonths, setDurationMonths] = useState(6)

  const presets = isUSD ? [200, 500, 1000, 2500] : [100000, 300000, 500000, 1000000]

  const numTarget = Math.max(0, Number(targetAmount) || 0)
  const numInitial = Math.min(numTarget, Math.max(0, Number(initialSaved) || 0))
  const remainingToSave = Math.max(0, numTarget - numInitial)

  const monthlyContribution = durationMonths > 0 ? remainingToSave / durationMonths : remainingToSave
  const weeklyContribution = durationMonths > 0 ? remainingToSave / (durationMonths * 4.33) : remainingToSave

  function handleSubmit(e) {
    if (e) e.preventDefault()
    if (numTarget <= 0) return

    const finalTitle = title.trim() || selectedCat.label
    const targetNgn = isUSD ? numTarget * exchangeRate : numTarget
    const savedNgn = isUSD ? numInitial * exchangeRate : numInitial
    const monthlyNgn = isUSD ? monthlyContribution * exchangeRate : monthlyContribution

    const deadlineDate = new Date()
    deadlineDate.setMonth(deadlineDate.getMonth() + durationMonths)
    const monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const formattedDeadline = `${monthsNames[deadlineDate.getMonth()]} ${deadlineDate.getFullYear()}`

    const newGoal = {
      id: 'goal_' + Date.now(),
      title: finalTitle,
      category: selectedCat.id,
      icon: selectedCat.icon,
      color: selectedCat.color,
      savedNgn,
      targetNgn,
      monthlyCommitmentNgn: Math.round(monthlyNgn),
      durationMonths,
      deadline: formattedDeadline
    }

    onCreateGoal(newGoal)
    onClose()
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 120,
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
          padding: '22px 20px 30px',
          border: '1px solid rgba(0, 168, 132, 0.18)',
          borderBottom: 'none',
          maxHeight: '92%',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(11, 61, 46, 0.12)'
        }}
      >
        <div style={{ width: '38px', height: '4px', background: 'rgba(11, 61, 46, 0.15)', borderRadius: '2px', margin: '0 auto 16px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>
              Create Savings Goal
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
              Set a target and let Aura calculate your pace
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
              Goal Type
            </label>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {GOAL_CATEGORIES.map(cat => {
                const isSelected = selectedCat.id === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCat(cat)
                      if (!title) setTitle(cat.label)
                    }}
                    style={{
                      flexShrink: 0,
                      padding: '8px 12px',
                      borderRadius: '14px',
                      border: isSelected ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.12)',
                      background: isSelected ? 'rgba(0, 168, 132, 0.12)' : '#F8FAF7',
                      color: isSelected ? '#00A884' : '#0F1F1B',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        background: cat.color,
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {cat.icon}
                    </div>
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
              Goal Name
            </label>
            <input
              type="text"
              placeholder={selectedCat.label}
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                background: '#F8FAF7',
                border: '1px solid rgba(0, 168, 132, 0.18)',
                borderRadius: '14px',
                padding: '0 14px',
                color: '#0F1F1B',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
              Target Amount ({currencySymbol})
            </label>
            <input
              type="number"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              min="1"
              step="any"
              required
              style={{
                width: '100%',
                height: '46px',
                background: '#F8FAF7',
                border: '1px solid rgba(0, 168, 132, 0.18)',
                borderRadius: '14px',
                padding: '0 14px',
                color: '#0B3D2E',
                fontSize: '16px',
                fontWeight: '800',
                outline: 'none',
                boxSizing: 'border-box',
                fontVariantNumeric: 'tabular-nums'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '8px' }}>
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTargetAmount(p.toString())}
                  style={{
                    padding: '7px 0',
                    borderRadius: '10px',
                    border: Number(targetAmount) === p ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.12)',
                    background: Number(targetAmount) === p ? 'rgba(0, 168, 132, 0.12)' : '#F8FAF7',
                    color: Number(targetAmount) === p ? '#00A884' : '#0F1F1B',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {currencySymbol}{p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
              Target Timeline
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.months}
                  type="button"
                  onClick={() => setDurationMonths(opt.months)}
                  style={{
                    padding: '10px 0',
                    borderRadius: '12px',
                    border: durationMonths === opt.months ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.12)',
                    background: durationMonths === opt.months ? 'rgba(0, 168, 132, 0.12)' : '#F8FAF7',
                    color: durationMonths === opt.months ? '#00A884' : '#0F1F1B',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(0, 168, 132, 0.08)',
              border: '1px solid rgba(0, 168, 132, 0.25)',
              borderRadius: '16px',
              padding: '14px'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#0B3D2E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Aura Smart Savings Plan
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Suggested Weekly Pace</span>
              <span style={{ fontSize: '13px', color: '#00A884', fontWeight: '800' }}>
                {currencySymbol}{weeklyContribution.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / wk
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Suggested Monthly Pace</span>
              <span style={{ fontSize: '13px', color: '#0B3D2E', fontWeight: '800' }}>
                {currencySymbol}{monthlyContribution.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / mo
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={numTarget <= 0}
            className="tap-spring"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 168, 132, 0.25)'
            }}
          >
            Launch Savings Goal
          </button>
        </form>
      </div>
    </div>
  )
}
