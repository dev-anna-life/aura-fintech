import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function TransactionPinModal({
  title = 'Authorize Transaction',
  subtitle = 'Enter your 4-digit transaction PIN to continue',
  onSuccess,
  onClose
}) {
  const [pin, setPin] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    if (pin.length === 4) {
      handleVerify(pin)
    }
  }, [pin])

  async function handleVerify(pinValue) {
    setIsVerifying(true)
    setError('')

    try {
      await api.verifyPin(pinValue)
      setIsVerifying(false)
      onSuccess()
    } catch (err) {
      setIsVerifying(false)
      setIsShaking(true)
      setError(err.message || 'Incorrect PIN. Default demo PIN is 1234.')

      setTimeout(() => {
        setIsShaking(false)
        setPin('')
      }, 500)
    }
  }

  function handleKeyPress(num) {
    if (isVerifying || pin.length >= 4) return
    setError('')
    setPin(prev => prev + num)
  }

  function handleBackspace() {
    if (isVerifying || pin.length === 0) return
    setError('')
    setPin(prev => prev.slice(0, -1))
  }

  function handleFaceIdFallback() {
    if (isVerifying) return
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      onSuccess()
    }, 600)
  }

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['face', '0', 'backspace']
  ]

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(12px)'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{`
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        @keyframes dotPop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div
        className="slide-up"
        style={{
          background: 'linear-gradient(180deg, #151622 0%, #0c0d14 100%)',
          borderRadius: '32px 32px 0 0',
          padding: '24px 22px 28px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: 'none',
          boxShadow: '0 -16px 40px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ width: '40px', height: '4px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '2px', margin: '0 auto 18px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                {title}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500', lineHeight: '1.4' }}>
              {subtitle}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '12px',
              width: '32px',
              height: '32px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '18px',
          marginTop: '16px',
          marginBottom: '16px',
          animation: isShaking ? 'pinShake 0.4s ease-in-out' : 'none'
        }}>
          {[0, 1, 2, 3].map(index => {
            const isFilled = pin.length > index
            const isError = Boolean(error) && isShaking
            return (
              <div
                key={index}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: isError
                    ? '#ef4444'
                    : isFilled
                      ? '#10b981'
                      : 'transparent',
                  border: isError
                    ? '2px solid #ef4444'
                    : isFilled
                      ? '2px solid #10b981'
                      : '2px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: isError
                    ? '0 0 14px rgba(239, 68, 68, 0.6)'
                    : isFilled
                      ? '0 0 14px rgba(16, 185, 129, 0.6)'
                      : 'none',
                  animation: isFilled ? 'dotPop 0.2s ease-out' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              />
            )
          })}
        </div>

        {error ? (
          <div style={{
            fontSize: '11px',
            color: '#f87171',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: '600',
            minHeight: '16px'
          }}>
            {error}
          </div>
        ) : (
          <div style={{
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.35)',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: '500',
            minHeight: '16px'
          }}>
            Default security PIN : 1234
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '300px',
          margin: '0 auto'
        }}>
          {keys.map((row, rIdx) => (
            <div key={rIdx} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              {row.map((k, cIdx) => {
                if (k === 'face') {
                  return (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={handleFaceIdFallback}
                      style={{
                        flex: 1,
                        height: '56px',
                        borderRadius: '16px',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        background: 'rgba(16, 185, 129, 0.08)',
                        color: '#10b981',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.12s ease'
                      }}
                    >
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M7 3H5a2 2 0 0 0-2 2v2m0 10v2a2 2 0 0 0 2 2h2m10 0h2a2 2 0 0 0 2-2v-2m0-10V5a2 2 0 0 0-2-2h-2" />
                        <circle cx="9" cy="9" r="1" fill="currentColor" />
                        <circle cx="15" cy="9" r="1" fill="currentColor" />
                        <path d="M9 15c1 1 2 1 3 1s2 0 3-1" />
                      </svg>
                    </button>
                  )
                }

                if (k === 'backspace') {
                  return (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={handleBackspace}
                      style={{
                        flex: 1,
                        height: '56px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.12s ease'
                      }}
                    >
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H20a2 2 0 012 2v10a2 2 0 01-2 2h-9.172a2 2 0 01-1.414-.586L3 12z" />
                      </svg>
                    </button>
                  )
                }

                return (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => handleKeyPress(k)}
                    style={{
                      flex: 1,
                      height: '56px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: '#ffffff',
                      fontSize: '22px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.12s ease'
                    }}
                  >
                    {k}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
