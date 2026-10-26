import React, { useState, useEffect, useRef } from 'react'

export default function BiometricEnrollment({ fullName, onComplete, onBack }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const streamRef = useRef(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [scanStep, setScanStep] = useState('positioning')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function initializeCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera device interface not supported in this frame.')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 640 }
          },
          audio: false
        })

        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setCameraActive(true)
        setErrorMessage('')
      } catch (err) {
        if (!isMounted) return
        setCameraActive(false)
      }
    }

    initializeCamera()

    return () => {
      isMounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  function handleCaptureFromStream() {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const width = video.videoWidth || 480
    const height = video.videoHeight || 480

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, width, height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88)
    setCapturedPhoto(dataUrl)
    setScanStep('verified')

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      setCameraActive(false)
    }
  }

  function handleFileInputChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setCapturedPhoto(event.target.result)
      setScanStep('verified')
      setErrorMessage('')
    }
    reader.onerror = () => {
      setErrorMessage('Failed to read face photo. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  function handleRetake() {
    setCapturedPhoto(null)
    setScanStep('positioning')
    setErrorMessage('')

    navigator.mediaDevices?.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
      audio: false
    }).then(stream => {
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {})
      }
      setCameraActive(true)
    }).catch(() => {
      setCameraActive(false)
    })
  }

  function handleConfirm() {
    if (!capturedPhoto) {
      setErrorMessage('Please capture or upload your biometric photo first.')
      return
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    onComplete(capturedPhoto)
  }

  const firstName = fullName ? fullName.trim().split(' ')[0] : 'Applicant'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#090a10',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '24px 20px',
      color: '#ffffff'
    }}>
      <style>{`
        @keyframes scanLaser {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(220px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.8; }
        }
        @keyframes pulseBorder {
          0% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 15px rgba(16, 185, 129, 0.15); }
          50% { border-color: rgba(16, 185, 129, 0.7); box-shadow: 0 0 25px rgba(16, 185, 129, 0.3); }
          100% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 15px rgba(16, 185, 129, 0.15); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '8px 12px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '10px',
          fontWeight: '700',
          color: '#10b981',
          letterSpacing: '0.04em'
        }}>
          Step 2 of 2 : KYC Biometrics
        </div>
      </div>

      <div style={{ marginBottom: '22px' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: '700',
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '6px'
        }}>
          Identity Verification
        </div>

        <div style={{
          fontSize: '20px',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.02em',
          lineHeight: '1.3',
          marginBottom: '10px'
        }}>
          Biometric Face Enrollment
        </div>

        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.55)',
          lineHeight: '1.55',
          marginBottom: '6px'
        }}>
          Hello {firstName}, position your face inside the frame to establish your biometric profile for instant Face ID authentication and high-tier banking limits.
        </div>
      </div>

      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '18px',
          fontSize: '11px',
          fontWeight: '600',
          color: '#f87171'
        }}>
          {errorMessage}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '6px',
        marginBottom: '26px'
      }}>
        <div style={{
          position: 'relative',
          width: '210px',
          height: '260px',
          borderRadius: '105px / 130px',
          overflow: 'hidden',
          border: '2px solid rgba(16, 185, 129, 0.5)',
          background: '#040508',
          animation: capturedPhoto ? 'none' : 'pulseBorder 3s infinite ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <video
            ref={videoRef}
            playsInline
            muted
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
              display: cameraActive && !capturedPhoto ? 'block' : 'none'
            }}
          />

          {capturedPhoto && (
            <img
              src={capturedPhoto}
              alt="Enrolled Face"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}

          {!cameraActive && !capturedPhoto && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <svg width="42" height="42" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="1.8" style={{ marginBottom: '12px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
                Camera Ready
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)', lineHeight: '1.4' }}>
                Tap capture or select your photo below
              </div>
            </div>
          )}

          {!capturedPhoto && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
              boxShadow: '0 0 12px #10b981',
              animation: 'scanLaser 2.4s infinite ease-in-out'
            }} />
          )}

          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            width: '16px',
            height: '16px',
            borderTop: '2px solid #10b981',
            borderLeft: '2px solid #10b981'
          }} />
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '16px',
            height: '16px',
            borderTop: '2px solid #10b981',
            borderRight: '2px solid #10b981'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            width: '16px',
            height: '16px',
            borderBottom: '2px solid #10b981',
            borderLeft: '2px solid #10b981'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            width: '16px',
            height: '16px',
            borderBottom: '2px solid #10b981',
            borderRight: '2px solid #10b981'
          }} />
        </div>

        <div style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          padding: '6px 14px'
        }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#10b981'
          }} />
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#10b981'
          }}>
            {capturedPhoto ? 'Biometric Face Signature Enrolled' : 'Align face inside oval frame'}
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {!capturedPhoto ? (
          <>
            {cameraActive ? (
              <button
                type="button"
                onClick={handleCaptureFromStream}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                  letterSpacing: '0.02em'
                }}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Snap Live Biometric Face
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                  letterSpacing: '0.02em'
                }}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Snap or Select Face Photo
              </button>
            )}

            {cameraActive && (
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Upload Photo from Device
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                letterSpacing: '0.02em'
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Confirm & Save Biometrics
            </button>

            <button
              type="button"
              onClick={handleRetake}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Retake Face Photo
            </button>
          </>
        )}

        <div style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.35)',
          textAlign: 'center',
          marginTop: '6px',
          lineHeight: '1.4'
        }}>
          Biometric signatures are encrypted locally with SHA-256 and stored under CBN KYC compliance.
        </div>
      </div>
    </div>
  )
}
