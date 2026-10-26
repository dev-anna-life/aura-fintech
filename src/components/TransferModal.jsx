import React, { useState } from 'react'
import { SUPPORTED_BANKS } from '../data/fintechData'
import TransactionPinModal from './TransactionPinModal'
import TransactionReceiptModal from './TransactionReceiptModal'

const NUMPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫']

export default function TransferModal({ user, onClose, onTransfer, beneficiaries = [] }) {
  const [tab, setTab] = useState('new')
  const [selectedContact, setSelectedContact] = useState(null)
  const [selectedBank, setSelectedBank] = useState('Kuda Bank')
  const [accountNumber, setAccountNumber] = useState('')
  const [resolvedName, setResolvedName] = useState('')
  const [isResolving, setIsResolving] = useState(false)
  const [saveBeneficiary, setSaveBeneficiary] = useState(true)

  const [step, setStep] = useState('recipient')
  const [amount, setAmount] = useState('0')
  const [narration, setNarration] = useState('')
  const [holding, setHolding] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [transferError, setTransferError] = useState('')
  const [showPinModal, setShowPinModal] = useState(false)
  const [completedTx, setCompletedTx] = useState(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  function handleAccountInput(val) {
    const cleaned = val.replace(/\D/g, '').slice(0, 10)
    setAccountNumber(cleaned)

    if (cleaned.length === 10) {
      setIsResolving(true)
      setTimeout(() => {
        setIsResolving(false)
        setResolvedName('Chinedu E. Okafor')
      }, 500)
    } else {
      setResolvedName('')
    }
  }

  function handleContinueFromNewAccount() {
    if (!resolvedName || accountNumber.length !== 10) return
    const customRecipient = {
      id: Date.now(),
      name: resolvedName,
      initials: 'CO',
      bank: selectedBank,
      account: accountNumber,
      color: '#00A884'
    }
    setSelectedContact(customRecipient)
    setStep('amount')
  }

  function handleSelectSaved(contact) {
    setSelectedContact(contact)
    setStep('amount')
  }

  function handleNumpad(key) {
    if (key === '⌫') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
      return
    }
    if (key === '.' && amount.includes('.')) return
    setAmount(prev => {
      if (prev === '0' && key !== '.') return key
      return prev + key
    })
  }

  function handleInitiateTransfer() {
    if (!selectedContact || Number(amount) <= 0 || confirmed) return
    setTransferError('')
    setShowPinModal(true)
  }

  async function handlePinSuccess() {
    setShowPinModal(false)
    setHolding(true)
    setTransferError('')

    try {
      const result = await onTransfer({
        recipientName: selectedContact.name,
        recipientBank: selectedContact.bank || selectedBank,
        recipientAccount: selectedContact.account || accountNumber,
        amount: Number(amount),
        narration: narration || 'Aura Vault Transfer',
        saveBeneficiary: tab === 'new' ? saveBeneficiary : false
      })
      setHolding(false)
      setConfirmed(true)
      const txData = result?.transaction || {
        id: Date.now(),
        merchant: 'Transfer to ' + selectedContact.name,
        recipientName: selectedContact.name,
        recipientBank: selectedContact.bank || selectedBank,
        recipientAccount: selectedContact.account || accountNumber,
        senderName: user?.name || 'Aura Account Holder',
        senderBank: 'Aura Microfinance Bank',
        senderAccount: user?.accountNumber || '8029148201',
        amount: -Number(amount),
        narration: narration || 'Aura Vault Transfer',
        status: 'Successful',
        date: 'Today, Just now',
        timestamp: new Date().toISOString()
      }
      setCompletedTx(txData)
      setShowReceiptModal(true)
    } catch (err) {
      setHolding(false)
      setTransferError(err.message || 'Transfer failed')
    }
  }

  if (showReceiptModal && completedTx) {
    return (
      <TransactionReceiptModal
        tx={completedTx}
        user={user}
        onClose={onClose}
      />
    )
  }

  return (
    <>
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
            maxHeight: '92%',
            overflowY: 'auto',
            boxShadow: '0 -10px 40px rgba(11, 61, 46, 0.12)'
          }}
        >
          <div style={{ width: '38px', height: '4px', background: 'rgba(11, 61, 46, 0.15)', borderRadius: '2px', margin: '0 auto 18px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', letterSpacing: '-0.02em' }}>
                {step === 'recipient' ? 'Send Money' : 'Transfer Amount'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500', marginTop: '2px' }}>
                Instant NIP zero-fee settlement
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

          {transferError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '14px',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '11px',
              color: '#dc2626',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {transferError}
            </div>
          )}

          {step === 'recipient' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#F8FAF7',
                borderRadius: '14px',
                padding: '4px',
                marginBottom: '18px',
                border: '1px solid rgba(0, 168, 132, 0.15)'
              }}>
                <button
                  type="button"
                  onClick={() => setTab('new')}
                  style={{
                    padding: '9px 0',
                    borderRadius: '11px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '700',
                    background: tab === 'new' ? '#00A884' : 'transparent',
                    color: tab === 'new' ? '#ffffff' : '#64748B',
                    boxShadow: tab === 'new' ? '0 4px 12px rgba(0, 168, 132, 0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setTab('saved')}
                  style={{
                    padding: '9px 0',
                    borderRadius: '11px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '700',
                    background: tab === 'saved' ? '#00A884' : 'transparent',
                    color: tab === 'saved' ? '#ffffff' : '#64748B',
                    boxShadow: tab === 'saved' ? '0 4px 12px rgba(0, 168, 132, 0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Saved ({beneficiaries.length})
                </button>
              </div>

              {tab === 'new' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                      Select Destination Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        background: '#F8FAF7',
                        border: '1px solid rgba(0, 168, 132, 0.2)',
                        borderRadius: '14px',
                        padding: '0 14px',
                        color: '#0F1F1B',
                        fontSize: '13px',
                        fontWeight: '600',
                        outline: 'none'
                      }}
                    >
                      {SUPPORTED_BANKS.map((bank, index) => (
                        <option key={index} value={bank} style={{ background: '#FFFFFF', color: '#0F1F1B' }}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                      NUBAN Account Number (10 Digits)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="10"
                      placeholder="e.g. 0123456789"
                      value={accountNumber}
                      onChange={e => handleAccountInput(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        background: '#F8FAF7',
                        border: '1px solid rgba(0, 168, 132, 0.2)',
                        borderRadius: '14px',
                        padding: '0 14px',
                        color: '#0F1F1B',
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        letterSpacing: '0.06em',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {isResolving && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      background: 'rgba(0, 168, 132, 0.08)',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 168, 132, 0.2)'
                    }}>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: '2px solid rgba(0, 168, 132, 0.3)',
                        borderTopColor: '#00A884',
                        animation: 'spin 0.8s linear infinite'
                      }} />
                      <span style={{ fontSize: '11px', color: '#00A884', fontWeight: '600' }}>
                        Resolving account name at {selectedBank}...
                      </span>
                    </div>
                  )}

                  {resolvedName && !isResolving && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: '#F8FAF7',
                      borderRadius: '14px',
                      border: '1px solid rgba(0, 168, 132, 0.25)'
                    }}>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: '700', color: '#00A884', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Verified Account Holder
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F1F1B', marginTop: '2px' }}>
                          {resolvedName}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748B', marginTop: '1px' }}>
                          {selectedBank} : {accountNumber}
                        </div>
                      </div>

                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#00A884',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {resolvedName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <input
                        type="checkbox"
                        id="saveBen"
                        checked={saveBeneficiary}
                        onChange={e => setSaveBeneficiary(e.target.checked)}
                        style={{ accentColor: '#00A884', cursor: 'pointer' }}
                      />
                      <label htmlFor="saveBen" style={{ fontSize: '11px', color: '#64748B', cursor: 'pointer', fontWeight: '500' }}>
                        Save as beneficiary for future transfers
                      </label>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={!resolvedName || accountNumber.length !== 10}
                    onClick={handleContinueFromNewAccount}
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '16px',
                      border: 'none',
                      background: resolvedName ? 'linear-gradient(135deg, #0B3D2E, #00A884)' : '#F1F5F2',
                      color: resolvedName ? '#ffffff' : '#94A3B8',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: resolvedName ? 'pointer' : 'default',
                      marginTop: '8px',
                      boxShadow: resolvedName ? '0 8px 24px rgba(0, 168, 132, 0.25)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Continue to Amount
                  </button>
                </div>
              )}

              {tab === 'saved' && (
                <div>
                  {beneficiaries.length === 0 ? (
                    <div style={{
                      padding: '36px 20px',
                      textAlign: 'center',
                      background: '#F8FAF7',
                      borderRadius: '16px',
                      border: '1px dashed rgba(0, 168, 132, 0.2)'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(0, 168, 132, 0.1)',
                        margin: '0 auto 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00A884'
                      }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F1F1B', marginBottom: '4px' }}>
                        No Saved Beneficiaries Yet
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4', marginBottom: '16px' }}>
                        Beneficiaries will automatically appear here when you make and save transfers.
                      </div>
                      <button
                        type="button"
                        onClick={() => setTab('new')}
                        style={{
                          background: 'rgba(0, 168, 132, 0.1)',
                          border: '1px solid rgba(0, 168, 132, 0.3)',
                          borderRadius: '12px',
                          padding: '8px 16px',
                          color: '#00A884',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Transfer to a Bank Account
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                      {beneficiaries.map(ben => (
                        <div
                          key={ben.id}
                          onClick={() => handleSelectSaved(ben)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 14px',
                            background: '#F8FAF7',
                            border: '1px solid rgba(0, 168, 132, 0.12)',
                            borderRadius: '14px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '12px',
                            background: 'rgba(0, 168, 132, 0.12)',
                            color: '#00A884',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '800'
                          }}>
                            {ben.initials || ben.name?.slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F1F1B' }}>{ben.name}</div>
                            <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                              {ben.bank} : {ben.account}
                            </div>
                          </div>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(11, 61, 46, 0.3)" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 'amount' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: '#F8FAF7',
                border: '1px solid rgba(0, 168, 132, 0.15)',
                borderRadius: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: 'rgba(0, 168, 132, 0.12)',
                    color: '#00A884',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '800'
                  }}>
                    {selectedContact?.initials || 'CO'}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F1F1B' }}>
                      {selectedContact?.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '1px' }}>
                      {selectedContact?.bank} : {selectedContact?.account}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('recipient')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00A884',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Transfer Amount
                </div>
                <div style={{ fontSize: '38px', fontWeight: '900', color: '#0B3D2E', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  ${amount}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {['25', '50', '100', '500'].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    style={{
                      padding: '8px 0',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 168, 132, 0.15)',
                      background: '#F8FAF7',
                      color: '#0F1F1B',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    +${preset}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
                {NUMPAD.map((key, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleNumpad(key)}
                    className="tap-spring"
                    style={{
                      height: '46px',
                      borderRadius: '14px',
                      border: '1px solid rgba(0, 168, 132, 0.12)',
                      background: '#F8FAF7',
                      color: '#0F1F1B',
                      fontSize: key === '⌫' ? '14px' : '18px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  value={narration}
                  onChange={e => setNarration(e.target.value)}
                  placeholder="Narration / Remark (e.g. Rent, Groceries, Food)"
                  maxLength={50}
                  style={{
                    width: '100%',
                    height: '42px',
                    boxSizing: 'border-box',
                    background: '#F8FAF7',
                    border: '1px solid rgba(0, 168, 132, 0.18)',
                    borderRadius: '14px',
                    padding: '0 14px',
                    color: '#0F1F1B',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="button"
                disabled={Number(amount) <= 0 || holding || confirmed}
                onClick={handleInitiateTransfer}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '16px',
                  border: 'none',
                  background: Number(amount) > 0 ? 'linear-gradient(135deg, #0B3D2E, #00A884)' : '#F1F5F2',
                  color: Number(amount) > 0 ? '#ffffff' : '#94A3B8',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: Number(amount) > 0 ? 'pointer' : 'default',
                  boxShadow: Number(amount) > 0 ? '0 8px 24px rgba(0, 168, 132, 0.25)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {holding ? (
                  <span>Processing Transfer...</span>
                ) : confirmed ? (
                  <span>Transfer Confirmed</span>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Authorize & Send ${amount}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {showPinModal && (
        <TransactionPinModal
          title="Authorize Transfer"
          subtitle={`Send $${amount} to ${selectedContact?.name} • ${selectedContact?.bank}`}
          onSuccess={handlePinSuccess}
          onClose={() => setShowPinModal(false)}
        />
      )}
    </>
  )
}
