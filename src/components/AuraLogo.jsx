import React from 'react'

export default function AuraLogo({ size = 32, showWordmark = false, light = false }) {
  const iconSize = typeof size === 'number' ? size : 32

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: showWordmark ? '10px' : '0' }}>
      <img
        src="/sovra-logo.png"
        alt="Sovra Logo"
        width={iconSize}
        height={iconSize}
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 8px rgba(0, 98, 255, 0.35))'
        }}
      />

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{
            fontSize: iconSize * 0.58 + 'px',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            color: light ? '#FFFFFF' : '#0F172A'
          }}>
            Sovra
          </span>
          <span style={{
            fontSize: iconSize * 0.22 + 'px',
            fontWeight: '800',
            letterSpacing: '0.08em',
            color: '#0062FF',
            textTransform: 'uppercase'
          }}>
            sovereign wealth
          </span>
        </div>
      )}
    </div>
  )
}
