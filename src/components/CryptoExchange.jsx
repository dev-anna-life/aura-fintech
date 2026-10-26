import React, { useState, useEffect } from 'react'
import AnimatedCounter from './AnimatedCounter'

const INITIAL_CRYPTO_ASSETS = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 63480.00,
    high: 64920.00,
    low: 62150.00,
    cap: '$1.25T',
    change24h: 2.85,
    color: '#f59e0b',
    timeframes: {
      '1H': [63100, 63250, 63180, 63320, 63480],
      '24H': [62150, 62600, 62400, 63100, 63480],
      '7D': [59800, 60900, 61400, 62200, 63480],
      '1M': [57200, 59100, 61000, 60400, 63480],
      '1Y': [28400, 38500, 49200, 58000, 63480]
    }
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3420.00,
    high: 3495.00,
    low: 3340.00,
    cap: '$410.8B',
    change24h: 1.94,
    color: '#8b5cf6',
    timeframes: {
      '1H': [3405, 3412, 3410, 3418, 3420],
      '24H': [3340, 3370, 3360, 3395, 3420],
      '7D': [3180, 3240, 3310, 3380, 3420],
      '1M': [2950, 3120, 3280, 3350, 3420],
      '1Y': [1620, 2150, 2800, 3200, 3420]
    }
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 148.50,
    high: 154.20,
    low: 142.10,
    cap: '$69.4B',
    change24h: 5.12,
    color: '#06b6d4',
    timeframes: {
      '1H': [147.2, 147.8, 148.1, 148.3, 148.5],
      '24H': [142.1, 144.5, 145.2, 147.0, 148.5],
      '7D': [131.0, 136.5, 141.0, 144.2, 148.5],
      '1M': [118.0, 126.0, 135.0, 142.0, 148.5],
      '1Y': [22.5, 45.0, 88.0, 125.0, 148.5]
    }
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    price: 585.00,
    high: 592.50,
    low: 578.00,
    cap: '$87.1B',
    change24h: -0.65,
    color: '#eab308',
    timeframes: {
      '1H': [586.2, 585.8, 585.5, 585.2, 585.0],
      '24H': [588.5, 586.0, 584.0, 584.5, 585.0],
      '7D': [570.0, 575.0, 582.0, 588.0, 585.0],
      '1M': [540.0, 560.0, 572.0, 580.0, 585.0],
      '1Y': [240.0, 310.0, 420.0, 530.0, 585.0]
    }
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether USD',
    price: 1.00,
    high: 1.001,
    low: 0.999,
    cap: '$118.2B',
    change24h: 0.01,
    color: '#10b981',
    timeframes: {
      '1H': [1.00, 1.00, 1.00, 1.00, 1.00],
      '24H': [1.00, 1.00, 1.00, 1.00, 1.00],
      '7D': [1.00, 1.00, 1.00, 1.00, 1.00],
      '1M': [1.00, 1.00, 1.00, 1.00, 1.00],
      '1Y': [1.00, 1.00, 1.00, 1.00, 1.00]
    }
  }
]

export default function CryptoExchange({ cashBalance, cryptoHoldings, onSwapSuccess }) {
  const [activeTab, setActiveTab] = useState('terminal')
  const [assets, setAssets] = useState(INITIAL_CRYPTO_ASSETS)
  const [selectedAssetId, setSelectedAssetId] = useState('bitcoin')
  const [timeframe, setTimeframe] = useState('24H')
  const [swapAmount, setSwapAmount] = useState('500')
  const [swapFromSymbol, setSwapFromSymbol] = useState('USD')
  const [swapToSymbol, setSwapToSymbol] = useState('BTC')
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapSuccess, setSwapSuccess] = useState(false)
  const [swapError, setSwapError] = useState('')

  useEffect(() => {
    async function fetchLivePrices() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,tether&vs_currencies=usd&include_24hr_change=true')
        if (!res.ok) return
        const data = await res.json()
        setAssets(prev => prev.map(a => {
          if (data[a.id]) {
            return {
              ...a,
              price: data[a.id].usd || a.price,
              change24h: Number((data[a.id].usd_24h_change || a.change24h).toFixed(2))
            }
          }
          return a
        }))
      } catch (err) {}
    }
    fetchLivePrices()
  }, [])

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0]
  const holdings = cryptoHoldings || { btc: 0.125, eth: 1.5, sol: 12.0, bnb: 3.5, usdt: 650.0 }

  const totalCryptoValue = (
    (holdings.btc || 0) * (assets.find(a => a.symbol === 'BTC')?.price || 63480) +
    (holdings.eth || 0) * (assets.find(a => a.symbol === 'ETH')?.price || 3420) +
    (holdings.sol || 0) * (assets.find(a => a.symbol === 'SOL')?.price || 148.5) +
    (holdings.bnb || 0) * (assets.find(a => a.symbol === 'BNB')?.price || 585) +
    (holdings.usdt || 0) * 1.0
  )

  const activePoints = selectedAsset.timeframes?.[timeframe] || [10, 20, 15, 25, 30]

  function generateSvgPath(points) {
    const width = 300
    const height = 75
    const min = Math.min(...points)
    const max = Math.max(...points)
    const range = (max - min) || 1

    return points.map((p, i) => {
      const x = (i / (points.length - 1)) * width
      const y = height - ((p - min) / range) * (height - 18) - 9
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
  }

  const isBuyMode = swapFromSymbol === 'USD'
  const targetCoin = assets.find(a => a.symbol === (isBuyMode ? swapToSymbol : swapFromSymbol)) || selectedAsset
  const targetPrice = targetCoin.price || 1

  const calculatedOutput = isBuyMode
    ? Number((Number(swapAmount || 0) / targetPrice).toFixed(6))
    : Number((Number(swapAmount || 0) * targetPrice).toFixed(2))

  function handleFlipSwap() {
    if (isBuyMode) {
      setSwapFromSymbol(swapToSymbol)
      setSwapToSymbol('USD')
    } else {
      setSwapToSymbol(swapFromSymbol)
      setSwapFromSymbol('USD')
    }
  }

  async function handleExecuteSwap() {
    setSwapError('')
    const num = Number(swapAmount)
    if (!num || num <= 0) return

    setIsSwapping(true)

    try {
      await onSwapSuccess({
        fromAsset: swapFromSymbol,
        toAsset: swapToSymbol,
        fromAmount: num,
        toAmount: calculatedOutput
      })
      setIsSwapping(false)
      setSwapSuccess(true)
      setTimeout(() => setSwapSuccess(false), 2000)
    } catch (err) {
      setIsSwapping(false)
      setSwapError(err.message || 'Swap execution failed')
    }
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      padding: '14px 16px 84px',
      overflowX: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px'
      }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Apex Crypto Markets
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500', marginTop: '2px' }}>
            Live Spot Feed : CoinGecko Verified
          </div>
        </div>

        <div style={{
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: '12px',
          padding: '3px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#10b981' }}>Live Feed</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '16px',
        padding: '3px',
        marginBottom: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box'
      }}>
        <button
          onClick={() => setActiveTab('terminal')}
          style={{
            padding: '8px 0',
            borderRadius: '13px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '700',
            background: activeTab === 'terminal' ? '#10b981' : 'transparent',
            color: activeTab === 'terminal' ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
            transition: 'all 0.2s ease'
          }}
        >
          Market Terminal
        </button>
        <button
          onClick={() => setActiveTab('swap')}
          style={{
            padding: '8px 0',
            borderRadius: '13px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '700',
            background: activeTab === 'swap' ? '#10b981' : 'transparent',
            color: activeTab === 'swap' ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
            transition: 'all 0.2s ease'
          }}
        >
          Instant Swap (DEX)
        </button>
      </div>

      {activeTab === 'terminal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{
            background: 'linear-gradient(135deg, #11111a 0%, #181826 60%, #0d0d15 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '22px',
            padding: '16px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
            boxSizing: 'border-box',
            width: '100%',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: selectedAsset.color + '26',
                  border: `1.5px solid ${selectedAsset.color}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '900',
                  color: selectedAsset.color,
                  flexShrink: 0
                }}>
                  {selectedAsset.symbol}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                    {selectedAsset.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
                    {selectedAsset.symbol} / USD Spot
                  </div>
                </div>
              </div>

              <div style={{
                background: selectedAsset.change24h >= 0 ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)',
                border: `1px solid ${selectedAsset.change24h >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: '10px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: '800',
                color: selectedAsset.change24h >= 0 ? '#10b981' : '#f87171'
              }}>
                {selectedAsset.change24h >= 0 ? '▲ +' : '▼ '}{Math.abs(selectedAsset.change24h)}%
              </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Spot Price
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                ${selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '10px',
              padding: '2px',
              marginBottom: '10px'
            }}>
              {['1H', '24H', '7D', '1M', '1Y'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: timeframe === tf ? '#10b981' : 'transparent',
                    color: timeframe === tf ? '#ffffff' : 'rgba(255,255,255,0.45)',
                    padding: '4px 0',
                    borderRadius: '8px',
                    fontSize: '9px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div style={{ width: '100%', height: '75px', position: 'relative', marginBottom: '10px', overflow: 'hidden' }}>
              <svg width="100%" height="75" viewBox="0 0 300 75" preserveAspectRatio="none" fill="none" style={{ display: 'block' }}>
                <path
                  d={generateSvgPath(activePoints)}
                  stroke={selectedAsset.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>24H HIGH</div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#f1f5f9', marginTop: '2px' }}>
                  ${(selectedAsset.high || selectedAsset.price * 1.02).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>24H LOW</div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#f1f5f9', marginTop: '2px' }}>
                  ${(selectedAsset.low || selectedAsset.price * 0.98).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>MARKET CAP</div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#f1f5f9', marginTop: '2px' }}>
                  {selectedAsset.cap}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            fontWeight: '800',
            color: 'rgba(255,255,255,0.45)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            paddingLeft: '2px'
          }}>
            Trending Markets
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            {assets.map(coin => {
              const isSelected = coin.id === selectedAssetId
              const isPositive = coin.change24h >= 0
              const holdingAmount = holdings[coin.symbol.toLowerCase()] || 0

              return (
                <div
                  key={coin.id}
                  onClick={() => setSelectedAssetId(coin.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '16px',
                    background: isSelected ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1.5px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '11px',
                      background: coin.color + '22',
                      border: `1px solid ${coin.color}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: coin.color,
                      flexShrink: 0
                    }}>
                      {coin.symbol}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                        {coin.name}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
                        {holdingAmount > 0 ? `${holdingAmount} ${coin.symbol}` : coin.symbol}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
                      ${coin.price.toLocaleString('en-US', { minimumFractionDigits: coin.price < 10 ? 2 : 2 })}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: isPositive ? '#10b981' : '#f87171',
                      marginTop: '1px'
                    }}>
                      {isPositive ? '+' : ''}{coin.change24h}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'swap' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '22px',
          padding: '16px',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
                Instant DEX Swap
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
                Spot execution with verified liquidity
              </div>
            </div>
            <div style={{
              background: 'rgba(6,182,212,0.12)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '10px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: '800',
              color: '#06b6d4'
            }}>
              0% Fee
            </div>
          </div>

          {swapError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '8px 12px',
              marginBottom: '12px',
              fontSize: '11px',
              color: '#f87171',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {swapError}
            </div>
          )}

          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '12px 14px',
            marginBottom: '10px',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>
              <span>You Pay</span>
              <span>
                Available: {isBuyMode ? `$${Number(cashBalance || 0).toLocaleString()}` : `${holdings[swapFromSymbol.toLowerCase()] || 0} ${swapFromSymbol}`}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <input
                type="number"
                value={swapAmount}
                onChange={e => setSwapAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '22px',
                  fontWeight: '800',
                  outline: 'none',
                  fontVariantNumeric: 'tabular-nums'
                }}
              />
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '800',
                color: '#ffffff',
                flexShrink: 0
              }}>
                {swapFromSymbol}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '-4px 0 6px', position: 'relative', zIndex: 5 }}>
            <button
              onClick={handleFlipSwap}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#1a1a26',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#06b6d4',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}
            >
              ⇅
            </button>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '12px 14px',
            marginBottom: '14px',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>
              <span>You Receive (Estimated)</span>
              <span>Rate: 1 {targetCoin.symbol} = ${targetPrice.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#10b981',
                fontVariantNumeric: 'tabular-nums',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {calculatedOutput}
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '800',
                color: '#ffffff',
                flexShrink: 0
              }}>
                {swapToSymbol}
              </div>
            </div>
          </div>

          <button
            onClick={handleExecuteSwap}
            disabled={isSwapping || swapSuccess || Number(swapAmount) <= 0}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '15px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '800',
              cursor: isSwapping || swapSuccess ? 'default' : 'pointer',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
              letterSpacing: '0.02em',
              transition: 'all 0.25s ease'
            }}
          >
            {swapSuccess ? 'Swap Executed Successfully' : isSwapping ? 'Executing on Chain...' : `Swap ${swapFromSymbol} to ${swapToSymbol}`}
          </button>
        </div>
      )}
    </div>
  )
}
