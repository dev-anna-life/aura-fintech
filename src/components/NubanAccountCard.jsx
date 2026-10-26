import React, { useState } from 'react'

export default function NubanAccountCard({ user, balance, hidden }) {
  const [copied, setCopied] = useState(false)

  const accountNumber = user?.accountNumber || '8029148201'
  const formattedAccount = accountNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  const accountName = (user?.name || user?.firstName || 'Aura Customer').toUpperCase()
  const displayBalance = Number(balance || 10000).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  const nairaEquivalent = (Number(balance || 10000) * 1625).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  function handleCopy() {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid rgba(0, 168, 132, 0.18)',
      borderRadius: '24px',
      padding: '20px 20px 18px',
      position: 'relative',
      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
      overflow: 'hidden',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00A884'
            }} />
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#0F1F1B',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              Aura Microfinance Bank
            </span>
          </div>

          <div style={{
            fontSize: '10px',
            color: '#64748B',
            fontWeight: '600'
          }}>
            CBN Licensed : NDIC Insured Partner
          </div>
        </div>

        <div style={{
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '12px',
          padding: '3px 9px',
          fontSize: '9px',
          fontWeight: '700',
          color: '#B8860B',
          letterSpacing: '0.04em'
        }}>
          Tier 2 Verified
        </div>
      </div>

      <div style={{
        background: '#F8FAF7',
        border: '1px solid rgba(0, 168, 132, 0.12)',
        borderRadius: '16px',
        padding: '12px 14px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            fontSize: '9px',
            fontWeight: '700',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '4px'
          }}>
            NUBAN Account Number
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#0F1F1B',
            letterSpacing: '0.08em',
            fontFamily: 'monospace'
          }}>
            {formattedAccount}
          </div>
          <div style={{
            fontSize: '10px',
            fontWeight: '600',
            color: '#64748B',
            marginTop: '3px'
          }}>
            {accountName}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: copied ? 'rgba(0, 168, 132, 0.2)' : 'rgba(0, 168, 132, 0.1)',
            border: copied ? '1px solid rgba(0, 168, 132, 0.45)' : '1px solid rgba(0, 168, 132, 0.25)',
            borderRadius: '12px',
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? (
            <>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#00A884" strokeWidth="2.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#00A884' }}>
                Copied
              </span>
            </>
          ) : (
            <>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#00A884" strokeWidth="2.2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#00A884' }}>
                Copy
              </span>
            </>
          )}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
      }}>
        <div style={{
          background: '#F8FAF7',
          border: '1px solid rgba(0, 168, 132, 0.12)',
          borderRadius: '14px',
          padding: '10px 12px'
        }}>
          <div style={{
            fontSize: '9px',
            fontWeight: '700',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px'
          }}>
            Available Balance
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '800',
            color: '#00A884'
          }}>
            {hidden ? '••••••' : `$${displayBalance}`}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#64748B',
            marginTop: '2px',
            fontWeight: '500'
          }}>
            {hidden ? '••••••' : `≈ ₦${nairaEquivalent}`}
          </div>
        </div>

        <div style={{
          background: '#F8FAF7',
          border: '1px solid rgba(0, 168, 132, 0.12)',
          borderRadius: '14px',
          padding: '10px 12px'
        }}>
          <div style={{
            fontSize: '9px',
            fontWeight: '700',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px'
          }}>
            Routing Partner
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '800',
            color: '#0F1F1B'
          }}>
            Wema / Providus
          </div>
          <div style={{
            fontSize: '9px',
            color: '#64748B',
            marginTop: '2px',
            fontWeight: '500'
          }}>
            Instant NIP Settled
          </div>
        </div>
      </div>
    </div>
  )
}
