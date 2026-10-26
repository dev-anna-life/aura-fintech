import React from 'react'

export default function QuickActions({ onRecord, onOpenBudgets, onOpenGoals, onViewLedger }) {
  const actions = [
    {
      id: 'record',
      label: 'Record',
      onClick: onRecord,
      isPrimary: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    },
    {
      id: 'budgets',
      label: 'Budgets',
      onClick: onOpenBudgets,
      isPrimary: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10h-10z" fill="rgba(255, 255, 255, 0.3)" />
        </svg>
      )
    },
    {
      id: 'goals',
      label: 'Goals',
      onClick: onOpenGoals,
      isPrimary: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      )
    },
    {
      id: 'ledger',
      label: 'History',
      onClick: onViewLedger,
      isPrimary: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      )
    }
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '0 4px' }}>
      {actions.map(action => (
        <button
          key={action.id}
          onClick={action.onClick}
          className="tap-spring"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '2px 0'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: action.isPrimary
                ? 'linear-gradient(135deg, #0B3D2E, #00A884)'
                : '#00A884',
              border: action.isPrimary ? '1.5px solid rgba(212, 175, 55, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: action.isPrimary
                ? '0 10px 22px rgba(11, 61, 46, 0.4)'
                : '0 8px 18px rgba(0, 168, 132, 0.32)',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {action.icon}
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F1F1B', letterSpacing: '-0.01em' }}>
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )
}
