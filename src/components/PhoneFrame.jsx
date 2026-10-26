import React, { useState, useEffect, useRef } from 'react'

export default function PhoneFrame({ children, islandAlert }) {
  const containerRef = useRef(null)
  const timerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [time, setTime] = useState('')
  const [activeAlert, setActiveAlert] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    function tick() {
      const now = new Date()
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function updateDimensions() {
      if (!containerRef.current) return
      const availableWidth = containerRef.current.clientWidth
      const availableHeight = containerRef.current.clientHeight
      const targetWidth = 393 + 32
      const targetHeight = 852 + 32
      const scaleX = availableWidth / targetWidth
      const scaleY = availableHeight / targetHeight
      const calculatedScale = Math.min(scaleX, scaleY, 1)
      setScale(Math.max(0.4, Number(calculatedScale.toFixed(3))))
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    const observer = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', updateDimensions)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (islandAlert) {
      setActiveAlert(islandAlert)
      setIsExpanded(true)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setIsExpanded(false)
        setTimeout(() => setActiveAlert(null), 450)
      }, 3800)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [islandAlert])

  const [isMobileScreen, setIsMobileScreen] = useState(false)

  useEffect(() => {
    function checkMobile() {
      const isMobile = window.innerWidth <= 520 || window.matchMedia('(display-mode: standalone)').matches
      setIsMobileScreen(isMobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobileScreen) {
    return (
      <div style={{ width: '100%', height: '100vh', background: '#F8FAF7', overflow: 'hidden', position: 'relative' }}>
        {activeAlert && (
          <div
            style={{
              position: 'fixed',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '360px',
              height: '56px',
              background: '#000000',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              justifyContent: 'space-between',
              zIndex: 999,
              boxShadow: '0 14px 36px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${activeAlert.color || '#10b981'}26`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeAlert.color || '#10b981' }} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>{activeAlert.title}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{activeAlert.subtitle}</div>
              </div>
            </div>
          </div>
        )}
        {children}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        background: 'radial-gradient(ellipse at 50% 30%, #151022 0%, #08080c 60%, #030305 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        transition: 'transform 0.12s ease-out',
        flexShrink: 0
      }}>
        <div style={{
          width: '393px',
          height: '852px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '54px',
          background: 'linear-gradient(160deg, #44444a 0%, #1c1c20 35%, #2a2a30 70%, #1a1a1e 100%)',
          boxShadow: `
            0 0 0 1px #5a5a62,
            0 0 0 3px #121215,
            0 0 0 4.5px #3a3a40,
            0 35px 90px rgba(0, 0, 0, 0.95),
            0 15px 40px rgba(0, 0, 0, 0.8),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.25),
            inset 0 -1.5px 0 rgba(0, 0, 0, 0.7)
          `,
          padding: '3px',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          <div style={{
            position: 'absolute',
            left: '-5px',
            top: '115px',
            width: '4px',
            height: '26px',
            background: 'linear-gradient(180deg, #505058, #2a2a30)',
            borderRadius: '3px 0 0 3px',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.5)'
          }} />
          <div style={{
            position: 'absolute',
            left: '-5px',
            top: '158px',
            width: '4px',
            height: '50px',
            background: 'linear-gradient(180deg, #505058, #2a2a30)',
            borderRadius: '3px 0 0 3px',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.5)'
          }} />
          <div style={{
            position: 'absolute',
            left: '-5px',
            top: '220px',
            width: '4px',
            height: '50px',
            background: 'linear-gradient(180deg, #505058, #2a2a30)',
            borderRadius: '3px 0 0 3px',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.5)'
          }} />
          <div style={{
            position: 'absolute',
            right: '-5px',
            top: '170px',
            width: '4px',
            height: '76px',
            background: 'linear-gradient(180deg, #505058, #2a2a30)',
            borderRadius: '0 3px 3px 0',
            boxShadow: '1px 0 2px rgba(0,0,0,0.5)'
          }} />

          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '51px',
            background: '#F8FAF7',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxSizing: 'border-box'
          }}>
            <div style={{
              height: '50px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'flex-end',
              paddingBottom: '8px',
              paddingLeft: '28px',
              paddingRight: '28px',
              zIndex: 100,
              background: 'transparent',
              position: 'relative',
              boxSizing: 'border-box'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#0F1F1B',
                flex: 1,
                letterSpacing: '-0.02em',
                opacity: isExpanded ? 0 : 1,
                transition: 'opacity 0.2s ease'
              }}>
                {time}
              </span>

              <div
                onClick={() => {
                  if (activeAlert) setIsExpanded(prev => !prev)
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isExpanded ? '348px' : '120px',
                  height: isExpanded ? '64px' : '32px',
                  background: '#000000',
                  borderRadius: isExpanded ? '28px' : '18px',
                  border: isExpanded ? '1px solid rgba(255, 255, 255, 0.16)' : '1.5px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: isExpanded ? '0 16px' : '0 10px',
                  justifyContent: isExpanded ? 'space-between' : 'center',
                  gap: isExpanded ? '12px' : '12px',
                  boxShadow: isExpanded
                    ? '0 14px 36px rgba(0, 0, 0, 0.95), 0 0 24px rgba(0,0,0,0.8)'
                    : '0 4px 14px rgba(0, 0, 0, 0.9)',
                  transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: 250,
                  cursor: activeAlert ? 'pointer' : 'default',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}
              >
                {!isExpanded ? (
                  <>
                    <div style={{
                      width: '11px',
                      height: '11px',
                      borderRadius: '50%',
                      background: '#0a0a10',
                      border: '1.5px solid #1f1f28'
                    }} />
                    <div style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: '#0a0a10',
                      border: '1.5px solid #1f1f28'
                    }} />
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    animation: 'fade-in 0.25s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '12px',
                        background: (activeAlert?.color || '#10b981') + '22',
                        border: `1.5px solid ${(activeAlert?.color || '#10b981')}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: activeAlert?.color || '#10b981',
                        fontSize: '14px',
                        fontWeight: '900',
                        flexShrink: 0
                      }}>
                        {activeAlert?.icon === 'card' && 'CD'}
                        {activeAlert?.icon === 'crypto' && 'CP'}
                        {activeAlert?.icon === 'send' && 'TX'}
                        {activeAlert?.icon === 'topup' && 'TU'}
                        {!['card', 'crypto', 'send', 'topup'].includes(activeAlert?.icon) && 'OK'}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '800',
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          letterSpacing: '-0.01em'
                        }}>
                          {activeAlert?.title || 'Activity Confirmed'}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.55)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: '500',
                          marginTop: '1px'
                        }}>
                          {activeAlert?.subtitle || 'Institutional vault updated'}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexShrink: 0,
                      paddingLeft: '8px'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '2px 7px',
                        fontSize: '9px',
                        fontWeight: '700',
                        color: activeAlert?.color || '#10b981',
                        letterSpacing: '0.02em'
                      }}>
                        LIVE
                      </div>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#0a0a10',
                        border: '1.5px solid #1f1f28'
                      }} />
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                opacity: isExpanded ? 0 : 1,
                transition: 'opacity 0.2s ease'
              }}>
                <svg width="16" height="11" viewBox="0 0 17 12" fill="#0F1F1B">
                  <rect x="0" y="5" width="3" height="7" rx="1" opacity="0.4" />
                  <rect x="4.5" y="3" width="3" height="9" rx="1" opacity="0.65" />
                  <rect x="9" y="1" width="3" height="11" rx="1" opacity="0.85" />
                  <rect x="13.5" y="0" width="3" height="12" rx="1" />
                </svg>
                <svg width="15" height="11" viewBox="0 0 16 12" fill="none">
                  <path d="M8 2.5C10.5 2.5 12.8 3.6 14.3 5.4L15.5 4C13.6 1.8 10.9 0.5 8 0.5C5.1 0.5 2.4 1.8 0.5 4L1.7 5.4C3.2 3.6 5.5 2.5 8 2.5Z" fill="#0F1F1B" />
                  <path d="M8 5.5C9.8 5.5 11.4 6.3 12.5 7.6L13.7 6.2C12.2 4.6 10.2 3.5 8 3.5C5.8 3.5 3.8 4.6 2.3 6.2L3.5 7.6C4.6 6.3 6.2 5.5 8 5.5Z" fill="#0F1F1B" />
                  <circle cx="8" cy="10" r="1.8" fill="#0F1F1B" />
                </svg>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                  <div style={{
                    width: '22px',
                    height: '11px',
                    border: '1.5px solid rgba(15, 31, 27, 0.6)',
                    borderRadius: '3.5px',
                    padding: '1.5px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{ width: '15px', height: '100%', background: '#00A884', borderRadius: '1.5px' }} />
                  </div>
                  <div style={{ width: '2px', height: '4px', background: 'rgba(15, 31, 27, 0.5)', borderRadius: '1px' }} />
                </div>
              </div>
            </div>

            <div style={{
              flex: 1,
              width: '100%',
              height: 'calc(100% - 76px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              position: 'relative',
              boxSizing: 'border-box'
            }}>
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>
              {children}
            </div>

            <div style={{
              height: '26px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              zIndex: 90,
              pointerEvents: 'none'
            }}>
              <div style={{
                width: '134px',
                height: '5px',
                background: 'rgba(15, 31, 27, 0.25)',
                borderRadius: '3px'
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
