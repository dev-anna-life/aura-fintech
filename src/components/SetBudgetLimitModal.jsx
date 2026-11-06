import React, { useState } from 'react'

const THRESHOLD_PRESETS = [
  { value: 50, label: '50% Early' },
  { value: 65, label: '65% Cautious' },
  { value: 75, label: '75% Normal' },
  { value: 85, label: '85% Late' },
  { value: 90, label: '90% Final' }
]

export default function SetBudgetLimitModal({
  categories = [],
  initialCategory = null,
  currentBudgets = {},
  currentThresholds = {},
  currency = 'NGN',
  onSaveLimit,
  onClose
}) {
  const defaultCategory = initialCategory || categories[0] || { id: 'Food', label: 'Food & Dining', icon: 'FD' }
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)

  const isUSD = currency === 'USD'
  const currentLimit = currentBudgets[selectedCategory.id] || (isUSD ? 40 : 60000)
  const initialThreshold = currentThresholds[selectedCategory.id] || 75

  const [amount, setAmount] = useState(currentLimit.toString())
  const [threshold, setThreshold] = useState(initialThreshold)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const currencySymbol = isUSD ? '$' : '₦'
  const presets = isUSD ? [25, 50, 100, 200] : [20000, 50000, 100000, 150000]

  function handleSelectCategory(cat) {
    setSelectedCategory(cat)
    const existing = currentBudgets[cat.id] || (isUSD ? 40 : 60000)
    setAmount(existing.toString())
    const existingTh = currentThresholds[cat.id] || 75
    setThreshold(existingTh)
  }

  const numericAmount = Number(amount) || 0
  const triggerAmount = Math.round(numericAmount * (threshold / 100))
  const bufferAmount = Math.max(0, numericAmount - triggerAmount)

  function handleSave(e) {
    if (e) e.preventDefault()
    if (!numericAmount || numericAmount <= 0) return

    onSaveLimit(selectedCategory.id, numericAmount, threshold)
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      onClose()
    }, 600)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(15, 31, 27, 0.65)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="slide-up"
        style={{
          background: '#FFFFFF',
          borderRadius: '32px 32px 0 0',
          padding: '20px 20px 28px',
          border: '1px solid rgba(0, 168, 132, 0.18)',
          borderBottom: 'none',
          maxHeight: '94%',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(11, 61, 46, 0.15)',
          scrollbarWidth: 'none'
        }}
      >
        <div style={{ width: '38px', height: '4px', background: 'rgba(11, 61, 46, 0.15)', borderRadius: '2px', margin: '0 auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>
              Set Spending Guardrail
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
              Custom limit & early warning threshold
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

        {/* Category Picker */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
            Choose Category
          </label>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const isSelected = selectedCategory.id === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
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
                      background: cat.color || '#00A884',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cat.icon || cat.label.slice(0, 2).toUpperCase()}
                  </div>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Amount Box */}
          <div style={{
            background: '#F8FAF7',
            border: '1px solid rgba(0, 168, 132, 0.18)',
            borderRadius: '20px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              Monthly Limit for {selectedCategory.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#0B3D2E' }}>{currencySymbol}</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                min="1"
                step="any"
                required
                style={{
                  fontSize: '30px',
                  fontWeight: '900',
                  color: '#0B3D2E',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  width: '180px',
                  textAlign: 'left',
                  fontVariantNumeric: 'tabular-nums'
                }}
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p.toString())}
                  style={{
                    padding: '8px 0',
                    borderRadius: '12px',
                    border: Number(amount) === p ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.12)',
                    background: Number(amount) === p ? 'rgba(0, 168, 132, 0.12)' : '#F8FAF7',
                    color: Number(amount) === p ? '#00A884' : '#0F1F1B',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {currencySymbol}{p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Alert Threshold Section */}
          <div style={{
            background: 'linear-gradient(145deg, #F8FAF7 0%, #FFFFFF 100%)',
            border: '1.5px solid rgba(0, 168, 132, 0.22)',
            borderRadius: '20px',
            padding: '14px 16px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '7px',
                  background: 'rgba(0, 168, 132, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px'
                }}>
                  🔔
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#0B3D2E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Budget Alert Trigger
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '500' }}>
                    Choose when Sovra sends you an alert
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
                borderRadius: '10px',
                padding: '4px 10px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '-0.01em'
              }}>
                {threshold}%
              </div>
            </div>

            {/* Threshold Preset Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none', marginBottom: '10px' }}>
              {THRESHOLD_PRESETS.map(item => {
                const isActive = threshold === item.value
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setThreshold(item.value)}
                    style={{
                      flexShrink: 0,
                      padding: '6px 10px',
                      borderRadius: '10px',
                      border: isActive ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.14)',
                      background: isActive ? '#00A884' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#0F1F1B',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    {item.value}%
                  </button>
                )
              })}
            </div>

            {/* Interactive Slider */}
            <div style={{ marginBottom: '10px' }}>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#00A884',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', fontWeight: '700', marginTop: '2px' }}>
                <span>40% (Early warning)</span>
                <span>75% (Normal)</span>
                <span>95% (Late)</span>
              </div>
            </div>

            {/* Real-time Math Breakdown */}
            <div style={{
              background: 'rgba(0, 168, 132, 0.06)',
              border: '1px dashed rgba(0, 168, 132, 0.28)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#0F1F1B', fontWeight: '600' }}>
                  Alert triggers when spent hits:
                </span>
                <span style={{ fontSize: '12px', color: '#0B3D2E', fontWeight: '900', fontVariantNumeric: 'tabular-nums' }}>
                  {currencySymbol}{triggerAmount.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '500' }}>
                  Money left before budget runs out:
                </span>
                <span style={{ fontSize: '11px', color: '#00A884', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>
                  {currencySymbol}{bufferAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!numericAmount || numericAmount <= 0}
            className="tap-spring"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '16px',
              border: 'none',
              background: savedSuccess
                ? '#00A884'
                : 'linear-gradient(135deg, #0B3D2E, #00A884)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              marginTop: '4px',
              boxShadow: '0 6px 20px rgba(0, 168, 132, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {savedSuccess ? (
              <span>Saved Successfully ✓</span>
            ) : (
              <span>Save Budget & Alert</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
