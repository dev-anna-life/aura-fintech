import React, { useState } from 'react'

const TOPUP_PRESETS = [100, 250, 500, 1000]
const PAYMENT_METHODS = [
  { id: 'card', name: 'Linked Visa Card (8821)', icon: 'CD' },
  { id: 'bank', name: 'Instant Bank Wire / ACH', icon: 'BW' },
  { id: 'pay', name: 'Apple / Google Pay', icon: 'AP' }
]

export default function TopUpModal({ onClose, onConfirmTopUp }) {
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [amount, setAmount] = useState('500')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleTopUpSubmit() {
    const num = Number(amount)
    if (!num || num <= 0) return
    setIsProcessing(true)
    setErrorMsg('')

    try {
      const methodName = PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name || 'Direct Deposit'
      await onConfirmTopUp(num, methodName)
      setIsProcessing(false)
      setIsDone(true)
      setTimeout(onClose, 1200)
    } catch (err) {
      setIsProcessing(false)
      setErrorMsg(err.message || 'Top up failed. Please try again.')
    }
  }

  return (
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
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>Top Up Account</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Instant balance funding</div>
          </div>
          <button
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

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '14px',
            padding: '10px 14px',
            marginBottom: '14px',
            fontSize: '11px',
            color: '#dc2626',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {errorMsg}
          </div>
        )}

        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
          background: '#F8FAF7',
          padding: '16px',
          borderRadius: '20px',
          border: '1px solid rgba(0, 168, 132, 0.15)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', marginBottom: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Funding Amount (USD)
          </div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#0B3D2E', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
            ${Number(amount || 0).toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {TOPUP_PRESETS.map(preset => (
            <button
              key={preset}
              onClick={() => setAmount(preset.toString())}
              style={{
                padding: '10px 0',
                borderRadius: '12px',
                border: Number(amount) === preset ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.12)',
                background: Number(amount) === preset ? 'rgba(0, 168, 132, 0.12)' : '#F8FAF7',
                color: Number(amount) === preset ? '#00A884' : '#0F1F1B',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              +${preset}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Select Payment Method
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PAYMENT_METHODS.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: selectedMethod === m.id ? 'rgba(0, 168, 132, 0.08)' : '#F8FAF7',
                  border: selectedMethod === m.id ? '1.5px solid #00A884' : '1px solid rgba(0, 168, 132, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(0, 168, 132, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#00A884'
                }}>
                  {m.icon}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F1F1B', flex: 1 }}>
                  {m.name}
                </div>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: selectedMethod === m.id ? '4px solid #00A884' : '2px solid rgba(11, 61, 46, 0.2)',
                  background: selectedMethod === m.id ? '#FFFFFF' : 'transparent'
                }} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleTopUpSubmit}
          disabled={isProcessing || isDone || Number(amount) <= 0}
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            cursor: isProcessing || isDone ? 'default' : 'pointer',
            boxShadow: '0 4px 14px rgba(0, 168, 132, 0.25)',
            letterSpacing: '0.02em',
            transition: 'all 0.3s'
          }}
        >
          {isDone ? 'Funded Successfully' : isProcessing ? 'Processing Transaction...' : `Top Up $${Number(amount || 0).toLocaleString()}`}
        </button>
      </div>
    </div>
  )
}
