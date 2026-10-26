import React, { useState } from 'react'
import { api } from '../services/api'
import LiveFaceScanner from './LiveFaceScanner'
import BiometricEnrollment from './BiometricEnrollment'
import AuraLogo from './AuraLogo'

export default function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('login')
  const [step, setStep] = useState('form')
  const [email, setEmail] = useState('alex.morgan@aura.io')
  const [password, setPassword] = useState('password123')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bvn, setBvn] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStage, setAuthStage] = useState('idle')
  const [showFaceScanner, setShowFaceScanner] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function handleFormSubmit(e) {
    if (e) e.preventDefault()
    setErrorMessage('')

    if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMessage('Full legal name, email, and passcode are required.')
        return
      }
      setStep('biometrics')
      return
    }

    if (mode === 'reset') {
      if (!email.trim() || !password) {
        setErrorMessage('Email and new passcode are required.')
        return
      }
      setIsAuthenticating(true)
      setAuthStage('Updating security credentials...')
      api.resetPassword({ email: email.trim().toLowerCase(), newPassword: password })
        .then(() => api.login({ email: email.trim().toLowerCase(), password }))
        .then(result => {
          setAuthStage('Passcode Updated : Banking Access Granted')
          setTimeout(() => {
            setIsAuthenticating(false)
            onLoginSuccess(result)
          }, 500)
        })
        .catch(err => {
          setIsAuthenticating(false)
          setErrorMessage(err.message || 'Passcode reset failed. Please check the email entered.')
        })
      return
    }

    setIsAuthenticating(true)
    setAuthStage('Authenticating institutional credentials...')

    api.login({ email: email.trim().toLowerCase(), password })
      .then(result => {
        setAuthStage('Identity Verified : Banking Access Granted')
        setTimeout(() => {
          setIsAuthenticating(false)
          onLoginSuccess(result)
        }, 500)
      })
      .catch(err => {
        setIsAuthenticating(false)
        setErrorMessage(err.message || 'Authentication failed. Please verify your details.')
      })
  }

  async function handleBiometricsComplete(photoDataUrl) {
    setErrorMessage('')
    setIsAuthenticating(true)
    setAuthStage('Encrypting facial biometrics and issuing NUBAN...')

    try {
      localStorage.setItem('aura_registered_face', photoDataUrl)
      const result = await api.register({
        fullName,
        email,
        password,
        phone,
        bvn,
        photoUrl: photoDataUrl
      })

      setAuthStage('Identity Verified : Tier 2 Account Created')
      setTimeout(() => {
        setIsAuthenticating(false)
        onLoginSuccess(result)
      }, 600)
    } catch (err) {
      setIsAuthenticating(false)
      setErrorMessage(err.message || 'Registration failed. Please check your details.')
      setStep('form')
    }
  }

  async function handleFaceScannerSuccess() {
    setShowFaceScanner(false)
    setIsAuthenticating(true)
    setAuthStage('Biometric Face ID Confirmed')

    try {
      const result = await api.login({ isDemo: true })
      setTimeout(() => {
        setIsAuthenticating(false)
        onLoginSuccess(result)
      }, 500)
    } catch (err) {
      setIsAuthenticating(false)
      setErrorMessage(err.message || 'Face ID authentication failed.')
    }
  }

  if (step === 'biometrics') {
    return (
      <BiometricEnrollment
        fullName={fullName}
        onComplete={handleBiometricsComplete}
        onBack={() => setStep('form')}
      />
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#F8FAF7',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'none'
    }}>
      <style>{`
        @keyframes heroPulse {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.04); opacity: 1; }
        }
        @keyframes springSheet {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div style={{
        position: 'relative',
        padding: '30px 24px 22px',
        background: '#FFFFFF',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        borderBottom: '1px solid rgba(0, 168, 132, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flexShrink: 0
      }}>
        <div style={{ marginBottom: '8px' }}>
          <AuraLogo size={42} showWordmark={true} light={true} />
        </div>

        <div style={{
          fontSize: '11px',
          color: '#64748B',
          fontWeight: '600',
          marginBottom: '12px',
          letterSpacing: '0.02em'
        }}>
          Institutional Wealth & Regulated Custody
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 168, 132, 0.1)',
          border: '1px solid rgba(0, 168, 132, 0.25)',
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '10px',
          fontWeight: '700',
          color: '#00A884'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00A884' }} />
          CBN Regulated : NDIC Insured Partner
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: '22px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        animation: 'springSheet 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }}>
        {mode === 'reset' ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '10px 16px',
            marginBottom: '20px',
            border: '1px solid rgba(0, 168, 132, 0.15)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage('') }}
              style={{
                background: 'none',
                border: 'none',
                color: '#00A884',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Sign In
            </button>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F1F1B' }}>Reset Master Passcode</span>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid rgba(0, 168, 132, 0.15)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage('') }}
              style={{
                padding: '10px 0',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                background: mode === 'login' ? '#00A884' : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#64748B',
                boxShadow: mode === 'login' ? '0 4px 14px rgba(0, 168, 132, 0.25)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage('') }}
              style={{
                padding: '10px 0',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                background: mode === 'register' ? '#00A884' : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#64748B',
                boxShadow: mode === 'register' ? '0 4px 14px rgba(0, 168, 132, 0.25)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '18px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#dc2626',
            textAlign: 'center'
          }}>
            <div>{errorMessage}</div>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => { setMode('reset'); setErrorMessage('') }}
                style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#00A884',
                  fontWeight: '700',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Reset passcode for this email
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#0F1F1B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: '7px'
                }}>
                  Legal Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Okon"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0, 168, 132, 0.2)',
                    borderRadius: '14px',
                    padding: '0 15px',
                    color: '#0F1F1B',
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#0F1F1B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: '7px'
                }}>
                  BVN Verification (11 Digits)
                </label>
                <input
                  type="text"
                  maxLength="11"
                  placeholder="22212345678"
                  value={bvn}
                  onChange={e => setBvn(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0, 168, 132, 0.2)',
                    borderRadius: '14px',
                    padding: '0 15px',
                    color: '#0F1F1B',
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#0F1F1B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: '7px'
                }}>
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0, 168, 132, 0.2)',
                    borderRadius: '14px',
                    padding: '0 15px',
                    color: '#0F1F1B',
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                  }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{
              fontSize: '10px',
              fontWeight: '700',
              color: '#0F1F1B',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: '7px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex.morgan@aura.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                height: '46px',
                background: '#FFFFFF',
                border: '1px solid rgba(0, 168, 132, 0.2)',
                borderRadius: '14px',
                padding: '0 15px',
                color: '#0F1F1B',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#0F1F1B',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {mode === 'reset' ? 'New Master Passcode' : 'Master Passcode'}
              </label>
              {mode === 'login' && (
                <span
                  onClick={() => { setMode('reset'); setErrorMessage('') }}
                  style={{ fontSize: '11px', color: '#00A884', fontWeight: '700', cursor: 'pointer' }}
                >
                  Forgot?
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'reset' ? 'Enter new passcode' : 'Enter passcode'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '46px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(0, 168, 132, 0.2)',
                  borderRadius: '14px',
                  padding: '0 46px 0 15px',
                  color: '#0F1F1B',
                  fontSize: '13px',
                  fontWeight: '600',
                  outline: 'none',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#00A884',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '700'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="tap-spring"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '800',
              cursor: isAuthenticating ? 'default' : 'pointer',
              marginTop: '10px',
              boxShadow: '0 8px 24px rgba(0, 168, 132, 0.25)',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {mode === 'login' ? (
              'Sign In to Account'
            ) : mode === 'reset' ? (
              'Update Passcode & Sign In'
            ) : (
              <>
                <span>Continue to Biometrics</span>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {mode === 'login' && (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(0, 168, 132, 0.15)' }} />
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>
                Instant Access
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(0, 168, 132, 0.15)' }} />
            </div>

            <button
              type="button"
              onClick={() => setShowFaceScanner(true)}
              disabled={isAuthenticating}
              className="tap-spring"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                border: '1px solid rgba(0, 168, 132, 0.25)',
                background: '#FFFFFF',
                color: '#0F1F1B',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00A884" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3H5a2 2 0 0 0-2 2v2m0 10v2a2 2 0 0 0 2 2h2m10 0h2a2 2 0 0 0 2-2v-2m0-10V5a2 2 0 0 0-2-2h-2" />
                <circle cx="9" cy="9" r="1" fill="#00A884" />
                <circle cx="15" cy="9" r="1" fill="#00A884" />
                <path d="M9 15c1 1 2 1 3 1s2 0 3-1" />
              </svg>
              Authenticate with Face ID
            </button>
          </div>
        )}

        <div style={{
          marginTop: 'auto',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '10px',
          color: '#64748B',
          fontWeight: '500'
        }}>
          Bank-grade 256-bit AES Encryption : Tier 2 Regulated
        </div>
      </div>

      {showFaceScanner && (
        <LiveFaceScanner
          onVerified={handleFaceScannerSuccess}
          onClose={() => setShowFaceScanner(false)}
        />
      )}

      {isAuthenticating && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(7, 7, 11, 0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          zIndex: 250
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: '3px solid rgba(16, 185, 129, 0.2)',
            borderTopColor: '#10b981',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#f1f5f9', textAlign: 'center', padding: '0 24px' }}>
            {authStage}
          </div>
        </div>
      )}
    </div>
  )
}
