import React, { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export default function LandingPage({
  onGetStarted,
  onSignIn,
  onExploreFeatures,
  onOpenAbout,
  onOpenContact,
  isAuthenticated,
  user,
  onGoToDashboard
}) {
  const [openFaq, setOpenFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lenisRef = useRef(null)

  useEffect(() => {
    // Initialize Lenis momentum inertia scroll on desktop
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.0,
      infinite: false
    })

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    // On mobile screens, immediately reveal everything for zero-latency scrolling
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      document.querySelectorAll('.sovra-reveal').forEach((el) => {
        el.classList.add('is-visible')
      })
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
            }
          })
        },
        { threshold: 0.05, rootMargin: '120px 0px 60px 0px' }
      )

      const elements = document.querySelectorAll('.sovra-reveal')
      elements.forEach((el) => observer.observe(el))
    }

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  const faqs = [
    {
      q: 'Is Sovra free to use?',
      a: 'Yes, opening a Sovra sovereign vault is 100% free with zero monthly maintenance charges. You get a dedicated Nigerian NUBAN account, real-time Safe-to-Spend calculations, and smart daily pacing at no cost.'
    },
    {
      q: 'Can I link my bank account?',
      a: 'You can instantly transfer funds into Sovra from any Nigerian commercial or microfinance bank (GTBank, Access, Zenith, Kuda, OPay) using your dedicated NUBAN account number. Funds reflect in your vault automatically in under 30 seconds.'
    },
    {
      q: 'Is my data safe with Sovra?',
      a: 'Your financial information is encrypted with bank-grade 256-bit AES encryption. Sovra complies with NDPR data protection standards and CBN regulatory guidelines. We never sell your personal data or share your financial records with third parties.'
    },
    {
      q: 'How does Safe-to-Spend work?',
      a: 'Safe-to-Spend automatically shields your committed fixed bills (rent, electricity, data) and locked savings goals from your total gross balance. It tells you the exact cash you can spend today without putting your end-of-month commitments at risk.'
    }
  ]

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index)
  }

  function scrollToSection(id) {
    setMobileMenuOpen(false)
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#' + id, { offset: -70, duration: 1.4 })
    } else {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  function scrollToTop() {
    setMobileMenuOpen(false)
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.4 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#FFFFFF',
      color: '#0F172A',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflowX: 'hidden'
    }}>
      {/* =========================================================================
          1. TOP NAVIGATION BAR
      ========================================================================= */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(4, 11, 34, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div
            onClick={scrollToTop}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <img
              src="/sovra-logo.png"
              alt="Sovra"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 10px rgba(0, 98, 255, 0.45))'
              }}
            />
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Sovra
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <button onClick={scrollToTop} style={navLinkStyleActive}>Home</button>
            <button onClick={() => scrollToSection('features')} style={navLinkStyle}>Features</button>
            <button onClick={() => scrollToSection('how-it-works')} style={navLinkStyle}>How It Works</button>
            <button onClick={onOpenAbout ? onOpenAbout : () => scrollToSection('why-sovra')} style={navLinkStyle}>About</button>
            <button onClick={() => scrollToSection('faq')} style={navLinkStyle}>FAQ</button>
          </nav>

          {/* Auth Actions */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isAuthenticated ? (
              <button
                className="sovra-btn-primary"
                onClick={onGoToDashboard || onGetStarted}
                style={{
                  background: '#0062FF',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 98, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Go to Dashboard ({user?.firstName || 'Vault'}) <span style={{ fontSize: '15px' }}>→</span>
              </button>
            ) : (
              <>
                <button
                  className="sovra-btn-secondary"
                  onClick={onSignIn}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '9px 22px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Sign In
                </button>
                <button
                  className="sovra-btn-primary"
                  onClick={onGetStarted}
                  style={{
                    background: '#0062FF',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '10px 24px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 98, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Get Started <span style={{ fontSize: '15px' }}>→</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-burger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            background: '#040B22',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <button onClick={scrollToTop} style={mobileNavLinkStyle}>Home</button>
            <button onClick={() => scrollToSection('features')} style={mobileNavLinkStyle}>Features</button>
            <button onClick={() => scrollToSection('how-it-works')} style={mobileNavLinkStyle}>How It Works</button>
            <button onClick={onOpenAbout ? onOpenAbout : () => scrollToSection('why-sovra')} style={mobileNavLinkStyle}>About</button>
            <button onClick={() => scrollToSection('faq')} style={mobileNavLinkStyle}>FAQ</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {isAuthenticated ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); (onGoToDashboard || onGetStarted)(); }}
                  style={{
                    background: '#0062FF',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Go to Dashboard ({user?.firstName || 'Vault'}) →
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onSignIn(); }}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
                    style={{
                      background: '#0062FF',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Get Started Free →
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION (Dark Navy with 3D Laptop Preview)
      ========================================================================= */}
      <section className="hero-section" style={{
        background: 'radial-gradient(ellipse at 80% 20%, rgba(0, 98, 255, 0.22) 0%, transparent 60%), #040B22',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="hero-grid" style={{
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Left Hero Content */}
          <div className="hero-text-col">
            <h1 className="hero-h1" style={{
              fontWeight: '900',
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              marginBottom: '20px'
            }}>
              Take control of your money.{' '}
              <span style={{
                background: 'linear-gradient(90deg, #0095FF 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                Build a better future.
              </span>
            </h1>

            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.72)',
              marginBottom: '32px'
            }}>
              Sovra helps you track spending, plan better, and save consistently - all in one place.
            </p>

            <div className="hero-btn-group">
              <button
                className="sovra-btn-primary"
                onClick={onGetStarted}
                style={{
                  background: '#0062FF',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '14px 30px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0, 98, 255, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Get Started Free →
              </button>

              <button
                className="sovra-btn-secondary"
                onClick={() => scrollToSection('features')}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '14px 28px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Right Hero Visual: 3D Laptop Dashboard */}
          <div className="laptop-mockup-wrapper" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Glowing Backdrop */}
            <div className="sovra-glow-pulse" style={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 98, 255, 0.35) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }} />

            {/* Laptop Hardware Frame */}
            <div className="sovra-float-laptop" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              borderRadius: '20px',
              padding: '10px 10px 0',
              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 98, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              {/* Laptop Screen Bezel */}
              <div style={{
                borderRadius: '12px 12px 4px 4px',
                background: '#FFFFFF',
                overflow: 'hidden',
                border: '1px solid #334155'
              }}>
                {/* Inside Screen Content (Sovra Desktop Web Dashboard) */}
                <div style={{ display: 'flex', minHeight: '260px' }}>
                  {/* Mini Sidebar */}
                  <div className="laptop-sidebar" style={{
                    width: '110px',
                    background: '#040B22',
                    padding: '14px 10px',
                    flexDirection: 'column',
                    gap: '12px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <img src="/sovra-logo.png" alt="Sovra" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                      <span style={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}>Sovra</span>
                    </div>

                    <div style={{ background: '#0062FF', borderRadius: '6px', padding: '6px 8px', color: '#fff', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>▦</span> Dashboard
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>⇄</span> Transactions
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>⚑</span> Savings
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>⚙</span> Settings
                    </div>
                  </div>

                  {/* Main Screen Body */}
                  <div style={{ flex: 1, background: '#F8FAFC', padding: '14px 16px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="sovra-pulse-dot" title="Live Sync Active" />
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>Good morning, Anna 👋</div>
                      </div>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0062FF', color: '#fff', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        UA
                      </div>
                    </div>

                    {/* Total Balance Card */}
                    <div style={{
                      background: 'linear-gradient(135deg, #040B22 0%, #0A1B44 100%)',
                      borderRadius: '12px',
                      padding: '14px',
                      color: '#fff',
                      marginBottom: '12px',
                      boxShadow: '0 6px 18px rgba(4, 11, 34, 0.25)',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Total Balance</span>
                        <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: '700' }}>↑ 12%</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                        ₦520,000.00
                      </div>
                      {/* Trendline wave */}
                      <svg width="100%" height="24" viewBox="0 0 200 30" fill="none">
                        <path d="M0 25 C40 10 70 28 110 12 C140 2 170 18 200 8" stroke="#0062FF" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>Recent Activity</span>
                        <span style={{ fontSize: '9px', fontWeight: '700', color: '#0062FF', cursor: 'pointer' }}>See all →</span>
                      </div>
                      <div style={{
                        background: '#FFFFFF',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #E2E8F0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N</div>
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#0F172A' }}>Netflix</div>
                            <div style={{ fontSize: '8px', color: '#64748B' }}>Today, 8:24 AM</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>-₦15.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Base */}
              <div style={{
                height: '14px',
                background: 'linear-gradient(180deg, #334155 0%, #1E293B 100%)',
                borderRadius: '0 0 16px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }} />
            </div>
          </div>
        </div>

        {/* Bottom Curved Wave Divider */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0
        }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" style={{ width: '100%', height: '36px', display: 'block' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          3. WHY SOVRA SECTION (Clean White Canvas)
      ========================================================================= */}
      <section id="why-sovra" className="why-sovra-section sovra-reveal" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div className="why-sovra-header" style={{ maxWidth: '600px' }}>
          <div style={pillBadgeStyle}>Why Sovra?</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.03em', margin: '12px 0 10px' }}>
            Managing money <br />should be simple.
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6' }}>
            Sovra gives you the tools to spend wisely, save more and reach your goals.
          </p>
        </div>

        {/* 3 Value Cards Grid */}
        <div id="features" className="why-sovra-grid">
          {/* Card 1 */}
          <div className="sovra-interactive-card" style={featureCardStyle}>
            <div style={iconBoxStyle}>
              <svg width="22" height="22" fill="none" stroke="#0062FF" strokeWidth="2.4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>Track Spending</h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
              See where your money goes with clear categories and real-time alerts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="sovra-interactive-card" style={featureCardStyle}>
            <div style={iconBoxStyle}>
              <svg width="22" height="22" fill="none" stroke="#0062FF" strokeWidth="2.4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>Plan Ahead</h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
              Prepare for what matters most by shielding rent and upcoming fixed bills.
            </p>
          </div>

          {/* Card 3 */}
          <div className="sovra-interactive-card" style={featureCardStyle}>
            <div style={iconBoxStyle}>
              <svg width="22" height="22" fill="none" stroke="#0062FF" strokeWidth="2.4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>Save Consistently</h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
              Build savings with ease using dedicated vaults that lock until maturity.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS SECTION (3 Simple Steps)
      ========================================================================= */}
      <section id="how-it-works" className="how-it-works-section sovra-reveal" style={{ background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
          <div style={pillBadgeStyle}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.02em', margin: '14px 0 40px' }}>
            Get started in just 3 simple steps.
          </h2>

          <div className="how-it-works-grid" style={{ position: 'relative' }}>
            {/* Step 1 */}
            <div className="sovra-step-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="sovra-step-badge" style={stepCircleStyle}>1</div>
              <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Create Account</h4>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '240px' }}>Sign up in minutes with your name and email.</p>
            </div>

            {/* Step 2 */}
            <div className="sovra-step-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="sovra-step-badge" style={stepCircleStyle}>2</div>
              <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Set Your Goals</h4>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '240px' }}>Plan for what matters and shield your rent.</p>
            </div>

            {/* Step 3 */}
            <div className="sovra-step-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="sovra-step-badge" style={stepCircleStyle}>3</div>
              <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Start Managing</h4>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '240px' }}>Track, save and grow with total peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CROSS-DEVICE COMPANION SECTION (Laptop + Mobile Phone)
      ========================================================================= */}
      <section className="companion-section sovra-reveal" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div className="companion-card" style={{
          background: 'radial-gradient(ellipse at 90% 50%, rgba(0, 98, 255, 0.3) 0%, transparent 70%), #040B22',
          color: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: '0 20px 50px -10px rgba(4, 11, 34, 0.4)'
        }}>
          {/* Left Text */}
          <div style={{ maxWidth: '100%' }}>
            <div style={{ ...pillBadgeStyle, background: 'rgba(0, 98, 255, 0.25)', color: '#38BDF8', border: '1px solid rgba(0, 98, 255, 0.4)' }}>
              Your Financial Companion
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.03em', margin: '14px 0 12px' }}>
              A smarter way <br />to manage your money.
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.72)', lineHeight: '1.6', marginBottom: '28px', maxWidth: '440px' }}>
              A clean and easy-to-use dashboard across all your devices. Real-time balance updates and intelligent pacing on laptop, tablet, and mobile.
            </p>
            <button
              className="sovra-btn-primary companion-btn"
              onClick={onGetStarted}
              style={{
                background: '#0062FF',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '13px 28px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 98, 255, 0.4)'
              }}
            >
              Explore Dashboard →
            </button>
          </div>

          {/* Right Dual Device Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%' }}>
            {/* Phone Frame */}
            <div className="sovra-float-phone" style={{
              width: '240px',
              maxWidth: '100%',
              borderRadius: '28px',
              padding: '8px',
              background: '#0F172A',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              margin: '0 auto'
            }}>
              <div style={{
                borderRadius: '20px',
                background: '#FFFFFF',
                padding: '12px',
                color: '#0F172A'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <img src="/sovra-logo.png" alt="Sovra" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#0062FF' }}>Sovra</span>
                  </div>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0062FF', color: '#fff', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>UA</div>
                </div>

                <div style={{
                  background: '#040B22',
                  borderRadius: '12px',
                  padding: '10px',
                  color: '#fff',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontSize: '9px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Total Balance</span>
                    <span className="sovra-pulse-dot" style={{ width: '6px', height: '6px' }} />
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '900', margin: '2px 0 6px' }}>₦520,000.00</div>
                  <div style={{ fontSize: '9px', color: '#38BDF8', fontWeight: '700' }}>↑ 12% vs last month</div>
                </div>

                <div style={{ fontSize: '10px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>Recent Activity</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#EF4444', color: '#fff', fontSize: '8px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N</div>
                    <span style={{ fontSize: '9px', fontWeight: '700' }}>Netflix</span>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800' }}>-₦15.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SECURITY MATTERS BANNER
      ========================================================================= */}
      <section className="security-section sovra-reveal" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div className="security-banner sovra-interactive-card" style={{
          background: '#F0F6FE',
          border: '1px solid #D0E2FD'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Padlock Icon */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#0062FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(0, 98, 255, 0.3)',
              flexShrink: 0
            }}>
              <svg width="22" height="22" fill="none" stroke="#FFFFFF" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div>
              <div style={{ ...pillBadgeStyle, padding: '3px 10px', fontSize: '11px', marginBottom: '4px' }}>
                Your Security Matters
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '2px' }}>
                Your data. Our priority.
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Your information is kept safe and secure with industry-standard 256-bit encryption.
              </p>
            </div>
          </div>

          <div className="security-banner-right" style={{
            fontWeight: '800',
            color: '#0F172A',
            letterSpacing: '0.02em'
          }}>
            Private. Secure. Reliable.
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FAQ ACCORDION SECTION
      ========================================================================= */}
      <section id="faq" className="faq-section sovra-reveal" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div className="faq-grid" style={{ alignItems: 'start' }}>
          {/* Left Column */}
          <div>
            <div style={pillBadgeStyle}>FAQs</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.02em', margin: '14px 0 10px' }}>
              Got questions?
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', marginBottom: '24px', maxWidth: '380px' }}>
              Find answers to common questions about Sovra, NUBAN accounts, and security.
            </p>
            <button
              className="sovra-btn-secondary"
              onClick={onOpenContact ? onOpenContact : () => scrollToSection('contact')}
              style={{
                background: 'transparent',
                border: '1.5px solid #0062FF',
                color: '#0062FF',
                borderRadius: '9999px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              View FAQs →
            </button>
          </div>

          {/* Right Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="sovra-faq-card"
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    background: isOpen ? '#F8FAFC' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleFaq(index)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
                      {faq.q}
                    </span>
                    <span
                      className="sovra-faq-indicator"
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#0062FF',
                        marginLeft: '12px',
                        display: 'inline-block',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                      }}
                    >
                      +
                    </span>
                  </div>
                  <div
                    className="sovra-faq-drawer"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        color: '#64748B',
                        lineHeight: '1.6',
                        borderTop: '1px solid #E2E8F0',
                        paddingTop: '10px'
                      }}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. READY TO TAKE CONTROL BANNER
      ========================================================================= */}
      <section className="cta-section sovra-reveal" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div className="cta-banner" style={{
          background: 'linear-gradient(135deg, #040B22 0%, #0A1B44 100%)',
          color: '#FFFFFF',
          boxShadow: '0 16px 40px rgba(4, 11, 34, 0.3)'
        }}>
          <div>
            <h3 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '900', color: '#FFFFFF', marginBottom: '6px' }}>
              Ready to take control of your financial future?
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Join Sovra today and experience a smarter way to manage your money.
            </p>
          </div>

          <button
            className="sovra-btn-primary cta-btn"
            onClick={onGetStarted}
            style={{
              background: '#0062FF',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '13px 28px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 98, 255, 0.45)',
              whiteSpace: 'nowrap'
            }}
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* =========================================================================
          9. FOOTER
      ========================================================================= */}
      <footer className="footer-wrapper" style={{
        background: '#040B22',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '12px'
      }}>
        <div className="footer-inner" style={{
          maxWidth: '1240px',
          margin: '0 auto'
        }}>
          {/* Brand */}
          <div onClick={scrollToTop} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <img
              src="/sovra-logo.png"
              alt="Sovra"
              style={{
                width: '26px',
                height: '26px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(0, 98, 255, 0.4))'
              }}
            />
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>Sovra</span>
          </div>

          {/* Nav links */}
          <div className="footer-links-row">
            <button onClick={scrollToTop} style={footerLinkStyle}>Home</button>
            <button onClick={() => scrollToSection('features')} style={footerLinkStyle}>Features</button>
            <button onClick={() => scrollToSection('how-it-works')} style={footerLinkStyle}>How It Works</button>
            <button onClick={onOpenAbout ? onOpenAbout : () => scrollToSection('why-sovra')} style={footerLinkStyle}>About</button>
            <button onClick={() => scrollToSection('faq')} style={footerLinkStyle}>FAQ</button>
            <button onClick={onOpenContact ? onOpenContact : () => scrollToSection('faq')} style={footerLinkStyle}>Contact</button>
          </div>

          {/* Copyright & Legal */}
          <div className="footer-legal-row">
            <span>© 2026 Sovra. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>
              <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* =========================================================================
    REUSABLE STYLE CONSTANTS
========================================================================= */
const navLinkStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.72)',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  padding: '4px 0'
}

const navLinkStyleActive = {
  ...navLinkStyle,
  color: '#FFFFFF',
  fontWeight: '800',
  borderBottom: '2px solid #0062FF'
}

const mobileNavLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '700',
  textAlign: 'left',
  cursor: 'pointer',
  padding: '6px 0'
}

const footerLinkStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer'
}

const pillBadgeStyle = {
  display: 'inline-block',
  background: '#EBF3FE',
  color: '#0062FF',
  borderRadius: '9999px',
  padding: '5px 14px',
  fontSize: '11px',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
}

const featureCardStyle = {
  background: '#FFFFFF',
  borderRadius: '18px',
  padding: '28px 24px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
}

const iconBoxStyle = {
  width: '46px',
  height: '46px',
  borderRadius: '12px',
  background: '#EBF3FE',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px'
}

const stepCircleStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: '#0062FF',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '900',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '14px',
  boxShadow: '0 4px 12px rgba(0, 98, 255, 0.35)'
}
