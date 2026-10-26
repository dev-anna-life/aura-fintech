import React from 'react'
import { TRANSACTIONS, formatTransactionDate } from '../data/fintechData'

export default function TransactionList({ customTransactions, onSelectTx, onViewAll, currency = 'NGN' }) {
  const txList = (customTransactions && customTransactions.length > 0) ? customTransactions : TRANSACTIONS
  const currencySymbol = currency === 'NGN' ? '₦' : '$'
  const multiplier = currency === 'NGN' ? 160 : 1

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F1F1B' }}>Recent Activity</span>
        <span
          onClick={onViewAll}
          style={{ fontSize: '12px', fontWeight: '700', color: '#00A884', cursor: 'pointer', padding: '2px 4px' }}
        >
          View All
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {txList.slice(0, 5).map((tx, index) => {
          const isPositive = tx.amount > 0
          const formattedAmount = (Math.abs(tx.amount) * multiplier).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })

          return (
            <div
              key={tx.id}
              className="staggered-item tap-spring"
              onClick={() => onSelectTx && onSelectTx(tx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '16px',
                background: '#FFFFFF',
                border: '1px solid rgba(0, 168, 132, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: isPositive ? 'rgba(0, 168, 132, 0.12)' : 'rgba(15, 31, 27, 0.06)',
                border: isPositive ? '1px solid rgba(0, 168, 132, 0.25)' : '1px solid rgba(15, 31, 27, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '800',
                color: isPositive ? '#00A884' : '#0F1F1B',
                flexShrink: 0,
                letterSpacing: '0.02em'
              }}>
                {tx.icon || 'TX'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F1F1B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tx.merchant}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  {formatTransactionDate(tx)}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: isPositive ? '#00A884' : '#0F1F1B',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {isPositive ? '+' : '-'}{currencySymbol}{formattedAmount}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#64748B',
                  marginTop: '2px'
                }}>
                  {tx.category}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
