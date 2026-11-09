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
      const isMobile = window.innerWidth <= 600 ||
        window.matchMedia('(display-mode: standalone)').matches ||
        Boolean(window.Capacitor) ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      setIsMobileScreen(isMobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobileScreen) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: '#F8FAF7',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        {/* Top Status Bar Safe Area Spacer for Real Phones */}
        <div style={{
          height: 'max(46px, env(safe-area-inset-top, 46px))',
          width: '100%',
          flexShrink: 0,
          background: '#F8FAF7',
          zIndex: 90
        }} />

        {activeAlert && (
          <div
            style={{
              position: 'fixed',
              top: 'max(52px, calc(env(safe-area-inset-top, 46px) + 6px))',
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

        <div style={{
          flex: 1,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}>
          {children}
        </div>

        {/* Bottom Gesture Bar Safe Area Spacer */}
        <div style={{
          height: 'max(8px, env(safe-area-inset-bottom, 8px))',
          width: '100%',
          flexShrink: 0,
          background: '#F8FAF7'
        }} />
      </div>
    )
  }

  // Desktop & tablet: full-screen web app layout (no phone frame outline)
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#F8FAF7',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* Dynamic Island alert banner for desktop */}
      {activeAlert && (
        <div
          style={{
            position: 'fixed',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '56px',
            background: '#000000',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            justifyContent: 'space-between',
            zIndex: 999,
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.5)'
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

      {/* Main content - centered column, max 480px wide on large screens */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {children}
      </div>
    </div>
  )
}
