import React, { useState } from 'react'

const EXPENSE_CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', color: '#f59e0b', icon: 'FD' },
  { id: 'Transport', label: 'Transport', color: '#0284c7', icon: 'TR' },
  { id: 'Bills', label: 'Bills & Utilities', color: '#6366f1', icon: 'BU' },
  { id: 'Shopping', label: 'Shopping', color: '#f43f5e', icon: 'SH' },
  { id: 'Subscription', label: 'Subscriptions', color: '#8b5cf6', icon: 'SB' },
  { id: 'Health', label: 'Health', color: '#00A884', icon: 'HL' },
  { id: 'Other', label: 'Other', color: '#64748b', icon: 'OT' }
]

const INCOME_CATEGORIES = [
  { id: 'Salary', label: 'Salary', color: '#00A884', icon: 'SL' },
  { id: 'Freelance', label: 'Freelance / Business', color: '#0284c7', icon: 'FB' },
  { id: 'Investment', label: 'Investment Return', color: '#d4af37', icon: 'IN' },
  { id: 'Gift', label: 'Gift / Transfer', color: '#8b5cf6', icon: 'GF' },
  { id: 'Other Income', label: 'Other Income', color: '#64748b', icon: 'OI' }
]

export default function AddTransactionModal({ isOpen, onClose, onAddTransaction, currency = 'NGN' }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id)
  const [merchant, setMerchant] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  if (!isOpen) return null

  const currencySymbol = currency === 'NGN' ? '₦' : '$'
  const activeCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  function handleTypeChange(newType) {
    setType(newType)
    setCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0].id : INCOME_CATEGORIES[0].id)
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const numericAmount = parseFloat(amount.replace(/,/g, ''))
    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid amount greater than zero.')
      return
    }

    if (!merchant.trim()) {
      setError('Please provide a description or merchant name.')
      return
    }

    const selectedCat = activeCategories.find(c => c.id === category) || activeCategories[0]
    const signedAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount)

    const newTx = {
      id: Date.now(),
      merchant: merchant.trim(),
      amount: signedAmount,
      category: selectedCat.label,
      color: selectedCat.color,
      icon: selectedCat.icon,
      date: 'Today',
      timestamp: Date.now(),
      type: type
    }

    onAddTransaction(newTx)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 31, 27, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 200,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div
        className="tap-spring"
        style={{
          width: '100%',
          maxWidth: '430px',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '20px 20px 32px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
          borderTop: '1px solid rgba(0, 168, 132, 0.18)',
          boxSizing: 'border-box',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#E2E8F0' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F1F1B' }}>
              Record Transaction
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>
              Track spending and keep your budget in check
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              fontSize: '14px',
              fontWeight: '700'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#F8FAF7',
          borderRadius: '14px',
          padding: '3px',
          marginBottom: '18px',
          border: '1px solid rgba(0, 168, 132, 0.14)'
        }}>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            style={{
              padding: '9px 0',
              borderRadius: '11px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '800',
              background: type === 'expense' ? '#0B3D2E' : 'transparent',
              color: type === 'expense' ? '#FFFFFF' : '#64748B',
              boxShadow: type === 'expense' ? '0 2px 8px rgba(11, 61, 46, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            style={{
              padding: '9px 0',
              borderRadius: '11px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '800',
              background: type === 'income' ? '#00A884' : 'transparent',
              color: type === 'income' ? '#FFFFFF' : '#64748B',
              boxShadow: type === 'income' ? '0 2px 8px rgba(0, 168, 132, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Income
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#DC2626',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Amount ({currency})
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                fontSize: '22px',
                fontWeight: '800',
                color: type === 'expense' ? '#0F1F1B' : '#00A884'
              }}>
                {currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                autoFocus
                required
                style={{
                  width: '100%',
                  height: '56px',
                  background: '#F8FAF7',
                  border: '1.5px solid rgba(0, 168, 132, 0.22)',
                  borderRadius: '16px',
                  padding: '0 16px 0 42px',
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#0F1F1B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activeCategories.map(cat => {
                const isSelected = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className="tap-spring"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '12px',
                      border: isSelected ? `1.5px solid ${cat.color}` : '1px solid rgba(0, 168, 132, 0.15)',
                      background: isSelected ? `${cat.color}18` : '#FFFFFF',
                      color: isSelected ? cat.color : '#0F1F1B',
                      fontSize: '12px',
                      fontWeight: isSelected ? '800' : '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: cat.color,
                      display: 'inline-block'
                    }} />
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Description / Merchant
            </label>
            <input
              type="text"
              placeholder={type === 'expense' ? 'e.g. Chicken Republic, Uber ride, Netflix' : 'e.g. October Salary, Web design contract'}
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              required
              style={{
                width: '100%',
                height: '46px',
                background: '#F8FAF7',
                border: '1px solid rgba(0, 168, 132, 0.18)',
                borderRadius: '14px',
                padding: '0 14px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#0F1F1B',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                width: '100%',
                height: '46px',
                background: '#F8FAF7',
                border: '1px solid rgba(0, 168, 132, 0.18)',
                borderRadius: '14px',
                padding: '0 14px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#0F1F1B',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            className="tap-spring"
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '16px',
              border: 'none',
              background: type === 'expense'
                ? 'linear-gradient(135deg, #0B3D2E, #00A884)'
                : 'linear-gradient(135deg, #00A884, #10B981)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              marginTop: '8px',
              boxShadow: '0 8px 20px rgba(0, 168, 132, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>{type === 'expense' ? 'Record Expense' : 'Record Income'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
