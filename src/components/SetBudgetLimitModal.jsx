import React, { useState } from 'react'

export default function SetBudgetLimitModal({
  categories = [],
  initialCategory = null,
  currentBudgets = {},
  currency = 'NGN',
  onSaveLimit,
  onClose
}) {
  const defaultCategory = initialCategory || categories[0] || { id: 'Food', label: 'Food & Dining', icon: 'FD' }
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)

  const isUSD = currency === 'USD'
  const currentLimit = currentBudgets[selectedCategory.id] || (isUSD ? 40 : 60000)
  const [amount, setAmount] = useState(currentLimit.toString())
  const [savedSuccess, setSavedSuccess] = useState(false)

  const currencySymbol = isUSD ? '$' : '₦'
  const presets = isUSD ? [25, 50, 100, 200] : [20000, 50000, 100000, 150000]

  function handleSelectCategory(cat) {
    setSelectedCategory(cat)
    const existing = currentBudgets[cat.id] || (isUSD ? 40 : 60000)
    setAmount(existing.toString())
  }

  function handleSave(e) {
    if (e) e.preventDefault()
    const num = Number(amount)
    if (!num || num <= 0) return

    onSaveLimit(selectedCategory.id, num)
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
          padding: '22px 20px 24px',
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
              Set Spending Limit
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
              Define monthly caps to protect your Safe-to-Spend
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

        <div style={{ marginBottom: '16px' }}>
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

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#F8FAF7',
            border: '1px solid rgba(0, 168, 132, 0.18)',
            borderRadius: '20px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
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
                  fontSize: '32px',
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

          <div>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
              Quick Presets
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p.toString())}
                  style={{
                    padding: '9px 0',
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

          <button
            type="submit"
            disabled={!Number(amount) || Number(amount) <= 0}
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
              marginTop: '6px',
              boxShadow: '0 6px 20px rgba(0, 168, 132, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {savedSuccess ? (
              <span>Limit Saved Successfully</span>
            ) : (
              <span>Save Category Limit</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
