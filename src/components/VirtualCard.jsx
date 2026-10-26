import React, { useState } from 'react'
import AnimatedCounter from './AnimatedCounter'

export default function VirtualCard({ wallet, accountType, balance, hidden, isFrozen, cardTheme = 'obsidian' }) {
  const [flipped, setFlipped] = useState(false)
  const cardHolder = wallet?.cardHolder || 'CARDHOLDER'
  const cardNumber = wallet?.cardNumber || '4829 •••• •••• 8821'
  const cvv = wallet?.cvv || '492'
  const expiry = wallet?.expiry || '08/29'
  const cardType = wallet?.cardType || 'Visa Infinite'
  const displayBalance = balance !== undefined ? balance : (wallet?.balance || 0)

  const THEMES = {
    obsidian: {
      bg: 'linear-gradient(135deg, #0d0d12 0%, #15151e 50%, #0a0a0f 100%)',
      glow: 'radial-gradient(circle, rgba(212, 175, 55, 0.14) 0%, transparent 70%)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      chipGradient: 'linear-gradient(135deg, #d4af37, #f3e5ab)',
      chipLine: '#997a15',
      accentColor: '#d4af37',
      labelColor: 'rgba(255, 255, 255, 0.45)',
      numberColor: 'rgba(255, 255, 255, 0.9)'
    },
    emerald: {
      bg: 'linear-gradient(135deg, #061c14 0%, #0d3326 50%, #04140e 100%)',
      glow: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      chipGradient: 'linear-gradient(135deg, #e2d4a8, #caba80)',
      chipLine: '#8a7840',
      accentColor: '#34d399',
      labelColor: 'rgba(167, 243, 208, 0.5)',
      numberColor: '#ecfdf5'
    },
    titanium: {
      bg: 'linear-gradient(135deg, #24252a 0%, #3a3b42 50%, #1e1f24 100%)',
      glow: 'radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, transparent 70%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      chipGradient: 'linear-gradient(135deg, #c0c0c0, #e8e8e8)',
      chipLine: '#7a7a7a',
      accentColor: '#f1f5f9',
      labelColor: 'rgba(255, 255, 255, 0.55)',
      numberColor: '#ffffff'
    }
  }

  const currentTheme = THEMES[cardTheme] || THEMES.obsidian

  return (
    <div
      className="card-flip-container spring-card"
      style={{ width: '100%', height: '204px', cursor: 'pointer', position: 'relative' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
        <div className="card-face">
          <div
            style={{
              width: '100%',
              height: '100%',
              background: isFrozen
                ? 'linear-gradient(135deg, #0e1e28 0%, #102a3a 50%, #0d2230 100%)'
                : currentTheme.bg,
              borderRadius: '22px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: isFrozen ? '1px solid rgba(6,182,212,0.4)' : currentTheme.border,
              boxShadow: '0 20px 44px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.18)',
              transition: 'background 0.4s, border 0.4s'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '220px',
              height: '220px',
              background: currentTheme.glow,
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            <div className="metallic-sweep" />

            {isFrozen && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(6, 182, 212, 0.15)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.75)',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#f1f5f9',
                  letterSpacing: '0.08em',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)'
                }}>
                  SECURITY FROZEN
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: currentTheme.labelColor, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                  {accountType || 'Private Wealth'} Liquid
                </div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                  {hidden ? '••••••••' : <AnimatedCounter value={displayBalance} />}
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '10px',
                padding: '5px 10px',
                fontSize: '10px',
                fontWeight: '800',
                color: currentTheme.accentColor,
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                {cardType}
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '28px',
                  background: currentTheme.chipGradient,
                  borderRadius: '6px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: '1.5px',
                  padding: '3.5px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ background: currentTheme.chipLine, opacity: 0.45, borderRadius: '1px' }} />
                  ))}
                </div>

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '9px', color: currentTheme.labelColor, marginBottom: '2px', letterSpacing: '0.08em' }}>CARD NUMBER</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: currentTheme.numberColor, letterSpacing: '0.12em', fontVariantNumeric: 'tabular-nums' }}>
                    {cardNumber}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '26px', height: '26px', background: '#eb001b', borderRadius: '50%', opacity: 0.95 }} />
                  <div style={{ width: '26px', height: '26px', background: '#f79e1b', borderRadius: '50%', marginLeft: '-9px', opacity: 0.95 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-face card-back">
          <div
            style={{
              width: '100%',
              height: '100%',
              background: currentTheme.bg,
              borderRadius: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              border: currentTheme.border
            }}
          >
            <div style={{ height: '42px', background: '#050508', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />

            <div style={{ padding: '0 22px 20px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '8px 14px',
                marginBottom: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div>
                  <div style={{ fontSize: '9px', color: currentTheme.labelColor, marginBottom: '1px', letterSpacing: '0.06em' }}>CVV</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', letterSpacing: '0.15em' }}>{cvv}</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: currentTheme.labelColor, marginBottom: '1px', letterSpacing: '0.06em' }}>EXPIRES</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', letterSpacing: '0.08em' }}>{expiry}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {cardHolder}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Tap front to flip back</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
