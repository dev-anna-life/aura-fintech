import React, { useState } from 'react'

export default function ReceiveModal({ user, onClose }) {
  const [copied, setCopied] = useState(false)

  const accountNumber = user?.accountNumber || '8029148201'
  const accountName = user?.name || 'ALEX MORGAN'
  const bankName = 'Aura Microfinance Bank'
  const routingNumber = '021000021'

  function handleCopy() {
    const text = `Account Name: ${accountName}\nBank: ${bankName}\nAccount Number: ${accountNumber}\nRouting: ${routingNumber}`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>Receive Money</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Your account deposit details</div>
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

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#F8FAF7',
          border: '1px solid rgba(0, 168, 132, 0.16)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '130px',
            height: '130px',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 4px 16px rgba(11, 61, 46, 0.08)',
            border: '1px solid rgba(0, 168, 132, 0.15)'
          }}>
            <svg width="110" height="110" viewBox="0 0 100 100" fill="#0B3D2E">
              <rect x="0" y="0" width="30" height="30" rx="4" />
              <rect x="6" y="6" width="18" height="18" fill="#fff" rx="2" />
              <rect x="10" y="10" width="10" height="10" />

              <rect x="70" y="0" width="30" height="30" rx="4" />
              <rect x="76" y="6" width="18" height="18" fill="#fff" rx="2" />
              <rect x="80" y="10" width="10" height="10" />

              <rect x="0" y="70" width="30" height="30" rx="4" />
              <rect x="6" y="76" width="18" height="18" fill="#fff" rx="2" />
              <rect x="10" y="80" width="10" height="10" />

              <rect x="36" y="10" width="8" height="8" />
              <rect x="48" y="10" width="8" height="8" />
              <rect x="36" y="24" width="20" height="8" />
              <rect x="40" y="38" width="20" height="8" />
              <rect x="10" y="44" width="12" height="12" />
              <rect x="76" y="44" width="14" height="8" />
              <rect x="36" y="70" width="10" height="10" />
              <rect x="52" y="74" width="14" height="8" />
              <rect x="74" y="74" width="18" height="18" />
            </svg>
          </div>

          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Aura Account Number
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0B3D2E', letterSpacing: '0.08em', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {accountNumber}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: '#F8FAF7', borderRadius: '14px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Account Name</span>
            <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '800' }}>{accountName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: '#F8FAF7', borderRadius: '14px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Bank Name</span>
            <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '800' }}>{bankName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: '#F8FAF7', borderRadius: '14px', border: '1px solid rgba(0, 168, 132, 0.1)' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Routing / Sort</span>
            <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '800' }}>{routingNumber}</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 168, 132, 0.25)',
            letterSpacing: '0.02em',
            transition: 'all 0.2s'
          }}
        >
          {copied ? 'Copied Account Details' : 'Copy All Details'}
        </button>
      </div>
    </div>
  )
}
