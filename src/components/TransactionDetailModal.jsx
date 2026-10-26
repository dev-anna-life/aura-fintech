import React, { useState } from 'react'
import TransactionReceiptModal from './TransactionReceiptModal'

export default function TransactionDetailModal({ tx, user, onClose }) {
  const [copied, setCopied] = useState(false)
  const [showOfficialReceipt, setShowOfficialReceipt] = useState(false)

  if (!tx) return null

  const isPositive = Number(tx.amount) > 0
  const refCode = tx.reference || ('AUR-' + (tx.id ? tx.id.toString().slice(-6) : '892014'))
  const isUSD = tx.currency === 'USD'
  const displayAmount = isUSD
    ? (isPositive ? '+' : '-') + '$' + Math.abs(Number(tx.amount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : (isPositive ? '+' : '-') + '₦' + Math.abs(Number(tx.amount || 0)).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  function handleCopyRef() {
    navigator.clipboard?.writeText(refCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
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
            padding: '22px 20px 20px',
            border: '1px solid rgba(0, 168, 132, 0.18)',
            borderBottom: 'none',
            boxShadow: '0 -10px 40px rgba(11, 61, 46, 0.12)'
          }}
        >
          <div style={{ width: '38px', height: '4px', background: 'rgba(11, 61, 46, 0.15)', borderRadius: '2px', margin: '0 auto 16px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>Transaction Details</div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Official transaction record</div>
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

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '18px 16px',
            background: '#F8FAF7',
            borderRadius: '20px',
            border: '1px solid rgba(0, 168, 132, 0.16)',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'rgba(0, 168, 132, 0.12)',
              border: '1px solid rgba(0, 168, 132, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '900',
              color: '#00A884',
              marginBottom: '10px'
            }}>
              {tx.icon || 'TX'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F1F1B' }}>
              {tx.merchant}
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '900',
              color: isPositive ? '#00A884' : '#0F1F1B',
              marginTop: '4px',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {displayAmount}
            </div>
            <div style={{
              marginTop: '8px',
              background: 'rgba(0, 168, 132, 0.1)',
              border: '1px solid rgba(0, 168, 132, 0.25)',
              borderRadius: '12px',
              padding: '3px 10px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#00A884'
            }}>
              Settlement Completed
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: '#F8FAF7', borderRadius: '14px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Reference Code</span>
              <span onClick={handleCopyRef} style={{ fontSize: '12px', color: '#00A884', fontWeight: '800', cursor: 'pointer' }}>
                {copied ? 'Copied' : refCode}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: '#F8FAF7', borderRadius: '14px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Category</span>
              <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '800' }}>{tx.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: '#F8FAF7', borderRadius: '14px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Date & Timestamp</span>
              <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '800' }}>{tx.date}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowOfficialReceipt(true)}
              style={{
                flex: 1,
                height: '46px',
                borderRadius: '16px',
                border: '1.5px solid rgba(0, 168, 132, 0.3)',
                background: 'rgba(0, 168, 132, 0.08)',
                color: '#00A884',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              View Official Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100px',
                height: '46px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 168, 132, 0.25)'
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {showOfficialReceipt && (
        <TransactionReceiptModal
          tx={tx}
          user={user}
          onClose={() => setShowOfficialReceipt(false)}
        />
      )}
    </>
  )
}
