import React from 'react'

export default function CategoryBreakdown({ transactions = [], currency = 'NGN' }) {
  const currencySymbol = currency === 'NGN' ? '₦' : '$'
  const multiplier = currency === 'NGN' ? 160 : 1

  const expenses = transactions.filter(t => t.amount < 0)
  const totalExpense = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const categoryMap = {}
  expenses.forEach(tx => {
    const cat = tx.category || 'Other'
    const color = tx.color || '#64748b'
    if (!categoryMap[cat]) {
      categoryMap[cat] = { name: cat, total: 0, color }
    }
    categoryMap[cat].total += Math.abs(tx.amount)
  })

  const categoryList = Object.values(categoryMap).sort((a, b) => b.total - a.total)

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid rgba(0, 168, 132, 0.15)',
      borderRadius: '20px',
      padding: '18px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F1F1B' }}>
            Spending by Category
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500', marginTop: '2px' }}>
            Where your money went this period
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#0F1F1B', fontVariantNumeric: 'tabular-nums' }}>
            {currencySymbol}{(totalExpense * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
            Total spent
          </div>
        </div>
      </div>

      {categoryList.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>
          No expenses recorded yet. Tap + Record to log your first expense.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categoryList.slice(0, 5).map((cat, idx) => {
            const percentage = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0
            const displayAmt = (cat.total * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: cat.color,
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F1F1B' }}>
                      {cat.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F1F1B', fontVariantNumeric: 'tabular-nums' }}>
                      {currencySymbol}{displayAmt}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', minWidth: '32px', textAlign: 'right' }}>
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: '#F1F5F9',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: cat.color,
                    borderRadius: '3px',
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
