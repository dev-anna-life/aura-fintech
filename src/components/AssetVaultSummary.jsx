import React from 'react'

export default function AssetVaultSummary({ onOpenVaults, wallet }) {
  const savings = wallet?.savingsVault || 4200.00
  const investments = wallet?.investmentPortfolio || 8840.12

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '22px',
      padding: '16px',
      border: '1px solid rgba(0, 168, 132, 0.18)',
      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F1F1B' }}>Institutional Vaults</div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '500', marginTop: '1px' }}>
            Compounding Custody Accounts
          </div>
        </div>
        <div style={{
          background: 'rgba(0, 168, 132, 0.12)',
          border: '1px solid rgba(0, 168, 132, 0.28)',
          color: '#00A884',
          fontSize: '10px',
          fontWeight: '800',
          padding: '3px 8px',
          borderRadius: '10px'
        }}>
          4.85% APY
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div
          onClick={onOpenVaults}
          className="tap-spring"
          style={{
            background: '#F8FAF7',
            border: '1px solid rgba(0, 168, 132, 0.12)',
            borderRadius: '16px',
            padding: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            Savings Vault
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#00A884', fontVariantNumeric: 'tabular-nums' }}>
            ${savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '500', marginTop: '4px' }}>
            Auto-compound active
          </div>
        </div>

        <div
          onClick={onOpenVaults}
          className="tap-spring"
          style={{
            background: '#F8FAF7',
            border: '1px solid rgba(0, 168, 132, 0.12)',
            borderRadius: '16px',
            padding: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            Treasury Assets
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F1F1B', fontVariantNumeric: 'tabular-nums' }}>
            ${investments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '9px', color: '#B8860B', fontWeight: '600', marginTop: '4px' }}>
            Tier 2 Custody Backed
          </div>
        </div>
      </div>
    </div>
  )
}
