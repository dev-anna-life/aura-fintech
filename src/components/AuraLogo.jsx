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
          <linearGradient id="sovraGradPrimary" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00A884" />
            <stop offset="70%" stopColor="#0B3D2E" />
            <stop offset="100%" stopColor="#041712" />
          </linearGradient>
          <linearGradient id="sovraGradAccent" x1="30" y1="10" x2="70" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#00A884" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" rx="26" fill="#0B3D2E" />

        <path
          d="M 68 28 C 60 18 46 18 36 24 C 25 31 25 45 35 51 C 45 57 66 59 71 68 C 76 77 71 90 56 92 C 41 94 29 86 26 76"
          stroke="url(#sovraGradAccent)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="68" cy="28" r="4.5" fill="#10B981" />
        <circle cx="26" cy="76" r="4.5" fill="#00A884" />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{
            fontSize: iconSize * 0.58 + 'px',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            color: light ? '#0F1F1B' : '#FFFFFF'
          }}>
            Sovra
          </span>
          <span style={{
            fontSize: iconSize * 0.24 + 'px',
            fontWeight: '800',
            letterSpacing: '0.08em',
            color: '#00A884',
            textTransform: 'uppercase'
          }}>
            sovereign wealth
          </span>
        </div>
      )}
    </div>
  )
}
