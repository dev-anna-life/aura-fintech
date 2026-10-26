import React, { useState } from 'react'
import { BUDGET_CATEGORIES } from '../data/fintechData'

const WEEK_DATA = [
  { day: 'Mon', amount: 45, height: '35%' },
  { day: 'Tue', amount: 92, height: '65%' },
  { day: 'Wed', amount: 30, height: '22%' },
  { day: 'Thu', amount: 140, height: '95%' },
  { day: 'Fri', amount: 80, height: '58%' },
  { day: 'Sat', amount: 115, height: '82%' },
  { day: 'Sun', amount: 25, height: '18%' }
]

export default function AnalyticsModal({ onClose, balance }) {
  const [selectedDay, setSelectedDay] = useState(WEEK_DATA[3])

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
          maxHeight: '90%',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(11, 61, 46, 0.12)'
        }}
      >
        <div style={{ width: '38px', height: '4px', background: 'rgba(11, 61, 46, 0.15)', borderRadius: '2px', margin: '0 auto 16px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>Spending Analytics</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Weekly and monthly breakdown</div>
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
          background: '#F8FAF7',
          border: '1px solid rgba(0, 168, 132, 0.16)',
          borderRadius: '20px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {selectedDay.day} Outflow
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#0B3D2E', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                ${selectedDay.amount}.00
              </div>
            </div>
            <div style={{
              background: 'rgba(0, 168, 132, 0.12)',
              border: '1px solid rgba(0, 168, 132, 0.25)',
              borderRadius: '10px',
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#00A884'
            }}>
              Weekly Peak
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '110px', paddingBottom: '4px' }}>
            {WEEK_DATA.map(item => {
              const isSelected = selectedDay.day === item.day
              return (
                <div
                  key={item.day}
                  onClick={() => setSelectedDay(item)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    height: '100%',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: item.height,
                    borderRadius: '8px',
                    background: isSelected ? 'linear-gradient(180deg, #0B3D2E, #00A884)' : 'rgba(0, 168, 132, 0.15)',
                    boxShadow: isSelected ? '0 4px 12px rgba(0, 168, 132, 0.35)' : 'none',
                    transition: 'all 0.2s'
                  }} />
                  <span style={{ fontSize: '10px', fontWeight: '700', color: isSelected ? '#00A884' : '#64748B' }}>
                    {item.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F1F1B', marginBottom: '10px' }}>Category Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {BUDGET_CATEGORIES.map(cat => {
              const pct = Math.min(100, Math.round((cat.spent / cat.total) * 100))
              return (
                <div key={cat.label} style={{
                  padding: '11px 14px',
                  background: '#F8FAF7',
                  borderRadius: '14px',
                  border: '1px solid rgba(0, 168, 132, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F1F1B' }}>{cat.label}</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: cat.color, fontVariantNumeric: 'tabular-nums' }}>
                      ${cat.spent} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(11, 61, 46, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: '3px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
