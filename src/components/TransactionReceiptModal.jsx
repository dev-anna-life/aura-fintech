import React, { useState } from 'react'

export default function TransactionReceiptModal({ tx, user, onClose }) {
  const [downloading, setDownloading] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  if (!tx) return null

  const absAmount = Math.abs(Number(tx.amount || 0))
  const nairaAmount = (absAmount * 1625).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 })
  const usdAmount = absAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

  const recipientName = tx.recipientName || (tx.merchant ? tx.merchant.replace(/^Transfer to /, '') : 'Chinedu E. Okafor')
  const recipientBank = tx.recipientBank || 'Kuda Bank'
  const rawRecipientAccount = tx.recipientAccount || '9048095365'
  const maskedRecipientAccount = rawRecipientAccount.length >= 7 ? rawRecipientAccount.slice(0, 3) + '****' + rawRecipientAccount.slice(-3) : rawRecipientAccount

  const senderName = tx.senderName || user?.name || 'Alex Morgan'
  const senderBank = 'Aura Microfinance Bank'
  const rawSenderAccount = tx.senderAccount || user?.accountNumber || '8029148201'
  const maskedSenderAccount = rawSenderAccount.length >= 7 ? rawSenderAccount.slice(0, 3) + '****' + rawSenderAccount.slice(-3) : rawSenderAccount

  const sessionId = tx.sessionId || ('110005' + (tx.id ? tx.id.toString() : Date.now().toString()) + '94810239481').slice(0, 26)
  const refCode = tx.reference || ('AUR-' + (tx.id ? tx.id.toString().slice(-6) : '892014'))
  const narration = tx.narration || 'Aura Vault Transfer'

  function formatAuraDate(dateVal) {
    const d = dateVal ? new Date(dateVal) : new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[d.getMonth()]
    const day = d.getDate().toString().padStart(2, '0')
    const year = d.getFullYear()
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    return `${day} ${month} ${year}, ${time}`
  }

  const txDate = formatAuraDate(tx.timestamp || tx.id)

  function showToast(msg) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  function handleCopy(text, key) {
    navigator.clipboard?.writeText(text)
    showToast(key + ' copied')
  }

  function buildAuraReceiptCanvas() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = 800
    const height = 1100
    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#F8FAF7'
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.roundRect(30, 30, width - 60, height - 60, 24)
    ctx.fill()

    ctx.strokeStyle = 'rgba(0, 168, 132, 0.25)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = '#00A884'
    ctx.beginPath()
    ctx.roundRect(width / 2 - 26, 65, 52, 52, 16)
    ctx.fill()

    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.moveTo(width / 2 - 11, 91)
    ctx.lineTo(width / 2 - 3, 100)
    ctx.lineTo(width / 2 + 12, 82)
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.fillStyle = '#0B3D2E'
    ctx.font = 'bold 22px system-ui, sans-serif'
    ctx.fillText('AURA MICROFINANCE BANK', width / 2, 148)

    ctx.fillStyle = '#64748B'
    ctx.font = '12px system-ui, sans-serif'
    ctx.fillText('LICENSED BY THE CENTRAL BANK OF NIGERIA : NDIC INSURED', width / 2, 170)

    ctx.strokeStyle = 'rgba(0, 168, 132, 0.4)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(width / 2 - 105, 192, 210, 28, 14)
    ctx.stroke()
    ctx.fillStyle = 'rgba(0, 168, 132, 0.12)'
    ctx.fill()

    ctx.fillStyle = '#00A884'
    ctx.font = 'bold 11px system-ui, sans-serif'
    ctx.fillText('TRANSFER SUCCESSFUL', width / 2, 210)

    ctx.fillStyle = '#0B3D2E'
    ctx.font = 'bold 36px system-ui, sans-serif'
    ctx.fillText(nairaAmount, width / 2, 264)

    ctx.fillStyle = '#B8860B'
    ctx.font = 'bold 14px system-ui, sans-serif'
    ctx.fillText(usdAmount, width / 2, 288)

    ctx.strokeStyle = 'rgba(0, 168, 132, 0.2)'
    ctx.setLineDash([8, 6])
    ctx.beginPath()
    ctx.moveTo(60, 318)
    ctx.lineTo(width - 60, 318)
    ctx.stroke()
    ctx.setLineDash([])

    const rows = [
      ['Transaction Type', 'NIP Instant Bank Transfer'],
      ['Recipient Name', recipientName],
      ['Destination Bank', recipientBank],
      ['Account Number', maskedRecipientAccount],
      ['Sender Name', senderName],
      ['Sender Bank', senderBank],
      ['Sender Account', maskedSenderAccount],
      ['NIP Session ID', sessionId],
      ['Reference Code', refCode],
      ['Date & Time', txDate],
      ['Remarks', narration],
      ['Settlement Status', 'NIP Instant Settled']
    ]

    let y = 360
    ctx.textAlign = 'left'

    rows.forEach(([label, value]) => {
      ctx.fillStyle = '#64748B'
      ctx.font = '13px system-ui, sans-serif'
      ctx.fillText(label, 70, y)

      ctx.textAlign = 'right'
      ctx.fillStyle = '#0F1F1B'
      ctx.font = 'bold 13px system-ui, sans-serif'
      const displayVal = value.length > 30 ? value.slice(0, 28) + '...' : value
      ctx.fillText(displayVal, width - 70, y)
      ctx.textAlign = 'left'

      ctx.strokeStyle = 'rgba(0, 168, 132, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(70, y + 14)
      ctx.lineTo(width - 70, y + 14)
      ctx.stroke()

      y += 45
    })

    ctx.textAlign = 'center'
    ctx.fillStyle = '#64748B'
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillText('Official electronic settlement generated via Nigeria Inter-Bank Settlement System (NIBSS).', width / 2, height - 60)

    return canvas
  }

  async function handleShareReceiptOnly() {
    try {
      const canvas = buildAuraReceiptCanvas()
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], `Aura-Receipt-${refCode}.png`, { type: 'image/png' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file]
            })
            showToast('Receipt image shared')
            return
          } catch (err) {
            if (err.name === 'AbortError') return
          }
        }

        if (navigator.share) {
          try {
            await navigator.share({
              title: `Aura Transfer Receipt: ${refCode}`
            })
            return
          } catch (err) {
            if (err.name === 'AbortError') return
          }
        }

        const link = document.createElement('a')
        link.download = `Aura-Receipt-${refCode}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        showToast('Receipt saved to device')
      }, 'image/png')
    } catch (e) {
      showToast('Sharing failed')
    }
  }

  function handleDownloadReceiptImage() {
    setDownloading(true)
    const canvas = buildAuraReceiptCanvas()

    setTimeout(() => {
      const link = document.createElement('a')
      link.download = `Aura-Receipt-${refCode}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setDownloading(false)
      showToast('Receipt saved to device')
    }, 200)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(15, 31, 27, 0.65)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="slide-up"
        style={{
          background: '#FFFFFF',
          borderRadius: '32px 32px 0 0',
          padding: '22px 18px 24px',
          border: '1px solid rgba(0, 168, 132, 0.18)',
          borderBottom: 'none',
          maxHeight: '94%',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 -10px 40px rgba(11, 61, 46, 0.15)'
        }}
      >
        <div style={{ width: '38px', height: '4px', background: 'rgba(11, 61, 46, 0.15)', borderRadius: '2px', margin: '0 auto 16px' }} />

        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#00A884',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              zIndex: 200,
              boxShadow: '0 8px 24px rgba(0, 168, 132, 0.4)'
            }}
          >
            {toastMessage}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>
              Transaction Receipt
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500', marginTop: '2px' }}>
              Official proof of transfer payment
            </div>
          </div>
          <button
            type="button"
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

        <div
          style={{
            background: '#F8FAF7',
            borderRadius: '24px',
            border: '1px solid rgba(0, 168, 132, 0.18)',
            padding: '22px 18px',
            position: 'relative',
            marginBottom: '18px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(11, 61, 46, 0.04)'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '18px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: '#00A884',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                boxShadow: '0 8px 24px rgba(0, 168, 132, 0.35)'
              }}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0B3D2E', letterSpacing: '0.02em' }}>
              AURA MICROFINANCE BANK
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Licensed by the Central Bank of Nigeria : NDIC Insured
            </div>
            <div
              style={{
                marginTop: '10px',
                background: 'rgba(0, 168, 132, 0.12)',
                border: '1px solid rgba(0, 168, 132, 0.3)',
                borderRadius: '14px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: '800',
                color: '#00A884'
              }}
            >
              TRANSFER SUCCESSFUL
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '900',
                color: '#0B3D2E',
                marginTop: '14px',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em'
              }}
            >
              {nairaAmount}
            </div>
            <div style={{ fontSize: '12px', color: '#B8860B', fontWeight: '700', marginTop: '2px' }}>
              {usdAmount}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              margin: '18px -18px',
              borderTop: '2px dashed rgba(0, 168, 132, 0.22)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-8px',
                top: '-9px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#FFFFFF'
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '-8px',
                top: '-9px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#FFFFFF'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Recipient Name</span>
              <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '800' }}>{recipientName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Destination Bank</span>
              <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '700' }}>{recipientBank}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Account Number</span>
              <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '800', fontFamily: 'monospace' }}>{maskedRecipientAccount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Sender Name</span>
              <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '700' }}>{senderName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Sender Bank</span>
              <span style={{ fontSize: '12px', color: '#0F1F1B', fontWeight: '700' }}>{senderBank}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>NIP Session ID</span>
              <span
                onClick={() => handleCopy(sessionId, 'Session ID')}
                style={{
                  fontSize: '11px',
                  color: '#00A884',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {sessionId.slice(0, 10)}...{sessionId.slice(-6)}
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Reference Code</span>
              <span
                onClick={() => handleCopy(refCode, 'Reference')}
                style={{
                  fontSize: '11px',
                  color: '#00A884',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {refCode}
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Date & Time</span>
              <span style={{ fontSize: '11px', color: '#0F1F1B', fontWeight: '700' }}>{txDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Narration</span>
              <span style={{ fontSize: '11px', color: '#0F1F1B', fontWeight: '700' }}>{narration}</span>
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0, 168, 132, 0.12)',
              fontSize: '10px',
              color: '#64748B',
              lineHeight: '1.45',
              textAlign: 'center'
            }}
          >
            Electronic proof generated via Nigeria Inter-Bank Settlement System (NIBSS) Instant Payment engine.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            type="button"
            onClick={handleShareReceiptOnly}
            style={{
              flex: 1,
              height: '46px',
              borderRadius: '16px',
              background: '#F8FAF7',
              border: '1px solid rgba(0, 168, 132, 0.25)',
              color: '#0B3D2E',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#00A884" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share Receipt
          </button>

          <button
            type="button"
            onClick={handleDownloadReceiptImage}
            disabled={downloading}
            style={{
              flex: 1,
              height: '46px',
              borderRadius: '16px',
              background: '#F8FAF7',
              border: '1px solid rgba(0, 168, 132, 0.25)',
              color: '#0B3D2E',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#00A884" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? 'Saving...' : 'Download Image'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 168, 132, 0.25)'
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
