import React, { useState } from 'react'

export default function InstallAppModal({ isOpen, onClose, onDirectInstall, hasPrompt }) {
  const [copied, setCopied] = useState(false)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

  if (!isOpen) return null

  function handleCopy() {
    navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 16px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#0B0D13',
          border: '1px solid rgba(0, 168, 132, 0.28)',
          borderRadius: '24px',
          padding: '24px 20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          color: '#F8FAF7'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'rgba(0, 168, 132, 0.15)',
              border: '1px solid rgba(0, 168, 132, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00A884'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAF7' }}>Install Aura App</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Direct standalone wealth experience</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {hasPrompt && (
          <button
            onClick={onDirectInstall}
            className="tap-spring"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              background: '#00A884',
              border: 'none',
              color: '#08090E',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px',
              boxShadow: '0 8px 20px rgba(0, 168, 132, 0.35)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Add Aura to Home Screen Now
          </button>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#00A884', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            {isIOS ? 'Instructions for iPhone (Safari)' : 'Instructions for Android (Chrome)'}
          </div>

          {isIOS ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,168,132,0.2)', color: '#00A884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px', flexShrink: 0 }}>1</span>
                <span>Open this link in <strong>Safari</strong> browser.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,168,132,0.2)', color: '#00A884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px', flexShrink: 0 }}>2</span>
                <span>Tap the <strong>Share</strong> button at the bottom of the screen.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,168,132,0.2)', color: '#00A884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px', flexShrink: 0 }}>3</span>
                <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,168,132,0.2)', color: '#00A884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px', flexShrink: 0 }}>1</span>
                <span>Open this link in <strong>Chrome</strong> browser.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,168,132,0.2)', color: '#00A884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px', flexShrink: 0 }}>2</span>
                <span>Tap the <strong>three dots</strong> menu (⋮) at top right.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,168,132,0.2)', color: '#00A884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px', flexShrink: 0 }}>3</span>
                <span>Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>).</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCopy}
            className="tap-spring"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: copied ? '#00A884' : '#F8FAF7',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Link Copied' : 'Copy Direct Link'}
          </button>

          <button
            onClick={onClose}
            className="tap-spring"
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
