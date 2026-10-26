import React from 'react'

export default function AuraLogo({ size = 32, showWordmark = false, light = false }) {
  const iconSize = typeof size === 'number' ? size : 32

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: showWordmark ? '10px' : '0' }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="auraArchGrad" x1="0" y1="100" x2="80" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00A884" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#0B3D2E" />
          </linearGradient>
          <linearGradient id="auraGoldWave" x1="15" y1="75" x2="85" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C89B2B" />
            <stop offset="45%" stopColor="#F6D365" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A87C1C" />
          </linearGradient>
        </defs>

        <path
          d="M 22 76 C 22 76 34 38 47 20 C 49 17 53 17 55 20 C 68 38 80 76 80 76 C 73 78 63 76 63 76 C 58 60 55 45 53 40 C 52 37 49 37 48 40 C 46 45 43 60 38 76 Z"
          fill="url(#auraArchGrad)"
        />

        <path
          d="M 24 70 C 33 66 44 52 52 46 C 62 39 74 46 80 50 C 76 56 68 59 61 55 C 51 49 41 60 31 73 Z"
          fill="url(#auraGoldWave)"
        />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{
            fontSize: iconSize * 0.58 + 'px',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            color: light ? '#0F1F1B' : '#FFFFFF'
          }}>
            Aura
          </span>
          <span style={{
            fontSize: iconSize * 0.28 + 'px',
            fontWeight: '600',
            letterSpacing: '0.02em',
            color: '#D4AF37',
            textTransform: 'lowercase'
          }}>
            smart wealth
          </span>
        </div>
      )}
    </div>
  )
}
