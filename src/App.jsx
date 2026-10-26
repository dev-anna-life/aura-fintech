import React, { useState, useEffect } from 'react'
import PhoneFrame from './components/PhoneFrame'
import VirtualCard from './components/VirtualCard'
import QuickActions from './components/QuickActions'
import AssetVaultSummary from './components/AssetVaultSummary'
import TransactionList from './components/TransactionList'
import TransferModal from './components/TransferModal'
import TopUpModal from './components/TopUpModal'
import ReceiveModal from './components/ReceiveModal'
import AnalyticsModal from './components/AnalyticsModal'
import TransactionDetailModal from './components/TransactionDetailModal'
import AuthScreen from './components/AuthScreen'
import CryptoExchange from './components/CryptoExchange'
import NubanAccountCard from './components/NubanAccountCard'
import AuraLogo from './components/AuraLogo'
import HeroBalanceCard from './components/HeroBalanceCard'
import GoalsSection from './components/GoalsSection'
import AddTransactionModal from './components/AddTransactionModal'
import CategoryBreakdown from './components/CategoryBreakdown'
import SafeToSpendCard from './components/SafeToSpendCard'
import BudgetsScreen from './components/BudgetsScreen'
import GoalsScreen from './components/GoalsScreen'
import { api, getToken } from './services/api'
import { USER, TRANSACTIONS, formatTransactionDate } from './data/fintechData'

function HomeScreen({
  user,
  wallet,
  balance,
  hidden,
  setHidden,
  notifications,
  setNotifications,
  onRecord,
  onOpenGoals,
  onOpenBudgets,
  onSelectTx,
  onViewAll,
  transactions,
  currency,
  setCurrency,
  budgets,
  goals,
  committedBills,
  committedSavings
}) {

  return (
    <div style={{ padding: '14px 18px 88px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <AuraLogo size={28} showWordmark={true} light={true} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            style={{
              position: 'relative',
              background: '#FFFFFF',
              border: '1px solid rgba(0, 168, 132, 0.18)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            onClick={() => setNotifications(0)}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#0F1F1B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifications > 0 && (
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '16px',
                height: '16px',
                background: '#00A884',
                borderRadius: '50%',
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: '900',
                color: '#FFFFFF'
              }}>
                {notifications}
              </div>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '500', color: '#64748B' }}>
            Good morning,
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0F1F1B', marginTop: '1px', letterSpacing: '-0.02em' }}>
            Welcome back
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#00A884', marginTop: '3px' }}>
            Your goals. Our priority.
          </div>
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: '800',
          color: '#ffffff',
          border: '1px solid rgba(0, 168, 132, 0.35)',
          boxShadow: '0 4px 14px rgba(0, 168, 132, 0.25)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.firstName || 'User'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            user.avatar || 'AM'
          )}
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00A884',
            border: '2px solid #FFFFFF'
          }} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <HeroBalanceCard
          balance={balance}
          hidden={hidden}
          setHidden={setHidden}
          currency={currency}
          onToggleCurrency={() => setCurrency(c => c === 'NGN' ? 'USD' : 'NGN')}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <SafeToSpendCard
          balance={balance}
          currency={currency}
          transactions={transactions}
          budgets={budgets}
          committedBills={committedBills}
          committedSavings={committedSavings}
          onOpenBudgets={onOpenBudgets}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <QuickActions
          onRecord={onRecord}
          onOpenBudgets={onOpenBudgets}
          onOpenGoals={onOpenGoals}
          onViewLedger={onViewAll}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <CategoryBreakdown
          transactions={transactions}
          currency={currency}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <GoalsSection
          goals={goals}
          currency={currency}
          onViewAll={onOpenGoals}
          onOpenGoal={onOpenGoals}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <TransactionList
          customTransactions={transactions}
          onSelectTx={onSelectTx}
          onViewAll={onViewAll}
          currency={currency}
        />
      </div>
    </div>
  )
}

function ActivityScreen({ transactions, onSelectTx, onRecord, currency = 'NGN' }) {
  const [filter, setFilter] = useState('All')
  const txList = transactions && transactions.length > 0 ? transactions : TRANSACTIONS
  const filters = ['All', 'Food & Dining', 'Transport', 'Bills & Utilities', 'Shopping', 'Subscriptions', 'Health', 'Income']
  const filtered = filter === 'All'
    ? txList
    : txList.filter(t => t.category === filter || (filter === 'Food & Dining' && (t.category === 'Food' || t.category === 'Dining' || t.category === 'Grocery')))

  const totalIn = txList.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalOut = txList.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)

  const currencySymbol = currency === 'NGN' ? '₦' : '$'
  const multiplier = currency === 'NGN' ? 160 : 1

  return (
    <div style={{ padding: '14px 18px 84px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F1F1B', marginBottom: '4px' }}>Spending Ledger</div>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Income and expenses tracker</div>
        </div>
        {onRecord && (
          <button
            onClick={onRecord}
            className="tap-spring"
            style={{
              background: '#00A884',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0, 168, 132, 0.25)'
            }}
          >
            <span>+ Record</span>
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          background: '#FFFFFF', border: '1px solid rgba(0, 168, 132, 0.2)',
          borderRadius: '16px', padding: '14px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#00A884', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Total Inflow
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#00A884', fontVariantNumeric: 'tabular-nums' }}>
            +{currencySymbol}{(totalIn * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div style={{
          background: '#FFFFFF', border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px', padding: '14px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#EF4444', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Total Outflow
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#EF4444', fontVariantNumeric: 'tabular-nums' }}>
            -{currencySymbol}{(totalOut * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px', scrollbarWidth: 'none' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: '20px',
              border: filter === f ? '1px solid #00A884' : '1px solid rgba(0, 168, 132, 0.15)',
              cursor: 'pointer',
              background: filter === f ? '#00A884' : '#FFFFFF',
              color: filter === f ? '#FFFFFF' : '#64748B',
              fontSize: '11px', fontWeight: '700',
              transition: 'all 0.2s',
              boxShadow: filter === f ? '0 2px 8px rgba(0, 168, 132, 0.25)' : 'none'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>
            No transactions found
          </div>
        )}
        {filtered.map((tx, idx) => {
          const isPositive = tx.amount > 0
          const displayAmount = (Math.abs(tx.amount) * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          return (
            <div
              key={tx.id}
              className="staggered-item tap-spring"
              onClick={() => onSelectTx && onSelectTx(tx)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '16px',
                background: '#FFFFFF',
                border: '1px solid rgba(0, 168, 132, 0.1)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                cursor: 'pointer',
                animationDelay: `${idx * 0.04}s`
              }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '14px',
                background: `${tx.color || '#00A884'}15`, border: `1px solid ${tx.color || '#00A884'}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '800',
                color: tx.color === '#000000' ? '#64748B' : (tx.color || '#00A884'), flexShrink: 0
              }}>
                {tx.icon || 'TX'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F1F1B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tx.merchant}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{formatTransactionDate(tx)}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: isPositive ? '#00A884' : '#0F1F1B', fontVariantNumeric: 'tabular-nums' }}>
                  {isPositive ? '+' : '-'}{currencySymbol}{displayAmount}
                </div>
                <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>{tx.category}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WalletScreen({ user, balance, wallet, hidden, isFrozen, onToggleFreeze, cardTheme, setCardTheme }) {
  const savings = wallet?.savingsVault || 4200.00
  const investments = wallet?.investmentPortfolio || 8840.12

  const accounts = [
    { label: 'Current Balance', amount: balance, color: '#00A884', sub: 'Liquid Private Account' },
    { label: 'High Yield Savings Vault', amount: savings, color: '#10b981', sub: '4.85% APY compounding' },
    { label: 'Global Investment Portfolio', amount: investments, color: '#D4AF37', sub: 'Equities, ETFs, and Treasury' }
  ]

  return (
    <div style={{ padding: '14px 18px 88px' }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F1F1B', marginBottom: '4px' }}>Accounts & Cards</div>
        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Custody accounts, virtual cards, and vaults</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#00A884' }}>Virtual Metal Card</span>
          <button
            onClick={onToggleFreeze}
            style={{
              background: isFrozen ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 168, 132, 0.08)',
              border: isFrozen ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(0, 168, 132, 0.2)',
              borderRadius: '8px',
              padding: '4px 12px',
              color: isFrozen ? '#ef4444' : '#00A884',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
          </button>
        </div>
        <VirtualCard
          wallet={wallet}
          accountType={user?.accountType}
          balance={balance}
          hidden={hidden}
          isFrozen={isFrozen}
          cardTheme={cardTheme}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <NubanAccountCard user={user} balance={balance} hidden={hidden} />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F1F1B', marginBottom: '10px' }}>Custody Vaults</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {accounts.map((acc, i) => (
            <div key={i} style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0, 168, 132, 0.12)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                flexShrink: 0,
                background: `${acc.color}18`,
                border: `1px solid ${acc.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: acc.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', marginBottom: '3px' }}>{acc.label}</div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F1F1B', fontVariantNumeric: 'tabular-nums' }}>
                  ${acc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '10px', color: acc.color, fontWeight: '600', marginTop: '2px' }}>{acc.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MoreScreen({ user, wallet, onSignOut, onViewActivity }) {
  const profileDetails = [
    { icon: 'ID', label: 'NUBAN Custody Account', value: user.accountNumber || '8029148201' },
    { icon: 'EM', label: 'Primary Email', value: user.email || 'alex.morgan@aura.io' },
    { icon: 'PH', label: 'Verified Phone', value: user.phone || '+234 801 234 5678' },
    { icon: 'TR', label: 'Compliance Level', value: 'Tier 2 : BVN & NIN Verified' },
    { icon: 'CD', label: 'Cardholder Name', value: wallet?.cardHolder || user.name || 'ALEX MORGAN' },
    { icon: 'DT', label: 'Member Since', value: user.memberSince || 'Sep 2026' }
  ]

  return (
    <div style={{ padding: '14px 18px 88px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F1F1B', marginBottom: '4px' }}>More & Profile</div>
        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Verified Private Client Credentials</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0B3D2E, #00A884)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: '900',
          color: '#ffffff',
          border: '1px solid rgba(0, 168, 132, 0.35)',
          boxShadow: '0 8px 24px rgba(0, 168, 132, 0.25)',
          marginBottom: '12px',
          overflow: 'hidden'
        }}>
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name || 'User'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            user.avatar || 'AM'
          )}
        </div>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F1F1B' }}>{user.name || 'Alex Morgan'}</div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', fontWeight: '500' }}>
          {user.accountType || 'Aura Institutional Vault'}
        </div>
        <div style={{
          marginTop: '8px',
          background: 'rgba(0, 168, 132, 0.12)',
          border: '1px solid rgba(0, 168, 132, 0.3)',
          borderRadius: '20px',
          padding: '4px 14px',
          fontSize: '11px',
          fontWeight: '800',
          color: '#00A884'
        }}>
          Tier 2 Regulated Account
        </div>
      </div>

      <button
        onClick={onViewActivity}
        className="tap-spring"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 168, 132, 0.25)',
          background: 'rgba(0, 168, 132, 0.1)',
          color: '#00A884',
          fontSize: '13px',
          fontWeight: '800',
          cursor: 'pointer',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        View Activity Ledger
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
        {profileDetails.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1px solid rgba(0, 168, 132, 0.12)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'rgba(0, 168, 132, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '800',
              color: '#00A884',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F1F1B', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onSignOut}
        className="tap-spring"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          background: 'rgba(239, 68, 68, 0.08)',
          color: '#DC2626',
          fontSize: '13px',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Sign Out
      </button>
    </div>
  )
}

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: (a) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={a ? '#00A884' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    id: 'activity',
    label: 'Spending',
    icon: (a) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={a ? '#00A884' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    id: 'wallet',
    label: 'Goals',
    icon: (a) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={a ? '#00A884' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    )
  },
  {
    id: 'more',
    label: 'More',
    icon: (a) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={a ? '#00A884' : '#94A3B8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="6" rx="1.5" />
        <rect x="15" y="3" width="6" height="6" rx="1.5" />
        <rect x="15" y="15" width="6" height="6" rx="1.5" />
        <rect x="3" y="15" width="6" height="6" rx="1.5" />
      </svg>
    )
  }
]

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(USER)
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState(USER.balance)
  const [transactions, setTransactions] = useState(TRANSACTIONS)
  const [beneficiaries, setBeneficiaries] = useState([])
  const [hidden, setHidden] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const [notifications, setNotifications] = useState(3)
  const [cardTheme, setCardTheme] = useState('emerald')
  const [currency, setCurrency] = useState('NGN')
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false)

  const [showTransfer, setShowTransfer] = useState(false)
  const [showTopUp, setShowTopUp] = useState(false)
  const [showReceive, setShowReceive] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [selectedTx, setSelectedTx] = useState(null)
  const [islandAlert, setIslandAlert] = useState(null)
  const [showBudgets, setShowBudgets] = useState(false)
  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_budgets')
      return saved ? JSON.parse(saved) : { Food: 60000, Transport: 25000, Bills: 45000, Shopping: 30000, Subscription: 15000, Health: 20000, Other: 15000 }
    } catch {
      return { Food: 60000, Transport: 25000, Bills: 45000, Shopping: 30000, Subscription: 15000, Health: 20000, Other: 15000 }
    }
  })

  function handleUpdateBudget(catId, newLimit) {
    setBudgets(prev => {
      const updated = { ...prev, [catId]: newLimit }
      try {
        localStorage.setItem('aura_budgets', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const DEFAULT_GOALS = [
    {
      id: 'goal_emergency',
      title: 'Emergency Cushion',
      name: 'Emergency Cushion',
      category: 'Emergency',
      icon: 'EF',
      color: '#00A884',
      savedNgn: 150000,
      targetNgn: 300000,
      monthlyCommitmentNgn: 15000,
      deadline: 'Dec 2026'
    },
    {
      id: 'goal_laptop',
      title: 'MacBook / Work Setup',
      name: 'MacBook / Work Setup',
      category: 'Tech',
      icon: 'TC',
      color: '#0B3D2E',
      savedNgn: 280000,
      targetNgn: 650000,
      monthlyCommitmentNgn: 10000,
      deadline: 'Feb 2027'
    },
    {
      id: 'goal_rent',
      title: 'Annual Rent Reserve',
      name: 'Annual Rent Reserve',
      category: 'Rent',
      icon: 'RN',
      color: '#00A884',
      savedNgn: 400000,
      targetNgn: 800000,
      monthlyCommitmentNgn: 20000,
      deadline: 'Mar 2027'
    }
  ]

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_savings_goals')
      return saved ? JSON.parse(saved) : DEFAULT_GOALS
    } catch {
      return DEFAULT_GOALS
    }
  })

  function saveGoals(nextGoals) {
    setGoals(nextGoals)
    try {
      localStorage.setItem('aura_savings_goals', JSON.stringify(nextGoals))
    } catch {}
  }

  function handleCreateGoal(newGoal) {
    saveGoals([newGoal, ...goals])
    triggerIsland({
      title: 'Savings Goal Created',
      subtitle: `${newGoal.title || newGoal.name} target activated`,
      icon: 'topup',
      color: newGoal.color || '#00A884'
    })
  }

  function handleContributeGoal(goalId, depositNgn, displayAmt, txCurrency) {
    const targetGoal = goals.find(g => g.id === goalId)
    const updated = goals.map(g => g.id === goalId ? { ...g, savedNgn: g.savedNgn + depositNgn } : g)
    saveGoals(updated)

    const deltaUsd = depositNgn / 160
    setBalance(prev => Math.max(0, prev - deltaUsd))

    if (targetGoal) {
      const goalLabel = targetGoal.title || targetGoal.name
      const txAmount = txCurrency === 'NGN' ? -(depositNgn / 160) : -displayAmt
      const savingsTx = {
        id: `tx_goal_${Date.now()}`,
        merchant: `Goal: ${goalLabel}`,
        category: 'Savings',
        date: 'Just now',
        timestamp: new Date().toISOString(),
        amount: Number(txAmount.toFixed(2)),
        status: 'Completed',
        type: 'expense',
        icon: targetGoal.icon || 'SV',
        color: targetGoal.color || '#00A884',
        note: 'Target Savings Contribution'
      }
      setTransactions(prev => [savingsTx, ...prev])
      triggerIsland({
        title: 'Goal Funded',
        subtitle: `Added to ${goalLabel}`,
        icon: 'topup',
        color: targetGoal.color || '#00A884'
      })
    }
  }

  function handleDeleteGoal(goalId) {
    const targetGoal = goals.find(g => g.id === goalId)
    saveGoals(goals.filter(g => g.id !== goalId))
    if (targetGoal) {
      triggerIsland({
        title: 'Goal Removed',
        subtitle: `${targetGoal.title || targetGoal.name} archived`,
        icon: 'card',
        color: '#64748B'
      })
    }
  }

  const activeMonthlyGoalsCommitment = goals
    .filter(g => g.savedNgn < g.targetNgn)
    .reduce((sum, g) => sum + (g.monthlyCommitmentNgn || 10000), 0)

  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    setIsStandalone(isStandaloneMode)

    function handleBeforeInstallPrompt(e) {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  async function handleInstallApp() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowInstallModal(false)
      }
    } else {
      setShowInstallModal(true)
    }
  }

  async function handleDirectInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowInstallModal(false)
      }
    }
  }

  function triggerIsland(alert) {
    setIslandAlert({ ...alert, timestamp: Date.now() })
  }

  useEffect(() => {
    async function initSession() {
      const token = getToken()
      if (token) {
        try {
          const profileData = await api.getCurrentUser()
          setUser(profileData.user)
          setWallet(profileData.wallet)
          setBalance(profileData.wallet?.balance || 0)
          setIsAuthenticated(true)

          const [txData, benData] = await Promise.all([
            api.getTransactions().catch(() => ({ transactions: [] })),
            api.getBeneficiaries().catch(() => ({ beneficiaries: [] }))
          ])
          setTransactions(txData.transactions || [])
          setBeneficiaries(benData.beneficiaries || [])
        } catch (e) {
          api.logout()
          setIsAuthenticated(false)
        }
      }
    }
    initSession()
  }, [])

  async function handleLoginSuccess(authResult) {
    if (authResult?.user) {
      setUser(authResult.user)
      setWallet(authResult.wallet)
      setBalance(authResult.wallet?.balance || 0)
      setIsAuthenticated(true)

      try {
        const [txData, benData] = await Promise.all([
          api.getTransactions().catch(() => ({ transactions: [] })),
          api.getBeneficiaries().catch(() => ({ beneficiaries: [] }))
        ])
        setTransactions(txData.transactions || [])
        setBeneficiaries(benData.beneficiaries || [])
      } catch (err) {}
      triggerIsland({
        title: 'Identity Verified',
        subtitle: 'Face ID session authenticated',
        icon: 'card',
        color: '#10b981'
      })
    }
    setActiveNav('home')
  }

  function handleSignOut() {
    api.logout()
    setIsAuthenticated(false)
    setActiveNav('home')
  }

  async function handleTransfer(transferPayload) {
    const result = await api.transfer(transferPayload)
    if (result.newBalance !== undefined) {
      setBalance(result.newBalance)
      setWallet(prev => prev ? { ...prev, balance: result.newBalance } : null)
    }
    if (result.transaction) {
      setTransactions(prev => [result.transaction, ...prev])
    }
    setNotifications(prev => prev + 1)
    triggerIsland({
      title: 'Transfer Completed',
      subtitle: `$${transferPayload.amount} sent to ${transferPayload.recipientName || 'Beneficiary'}`,
      icon: 'send',
      color: '#10b981'
    })

    if (transferPayload.saveBeneficiary) {
      const benData = await api.getBeneficiaries().catch(() => ({ beneficiaries: [] }))
      setBeneficiaries(benData.beneficiaries || [])
    }
    return result
  }

  async function handleConfirmTopUp(amount, method) {
    const result = await api.topUp({ amount, method })
    if (result.newBalance !== undefined) {
      setBalance(result.newBalance)
      setWallet(prev => prev ? { ...prev, balance: result.newBalance } : null)
    }
    if (result.transaction) {
      setTransactions(prev => [result.transaction, ...prev])
    }
    setNotifications(prev => prev + 1)
    triggerIsland({
      title: 'Vault Funded',
      subtitle: `+$${amount} deposited via ${method || 'Card'}`,
      icon: 'topup',
      color: '#10b981'
    })
  }

  async function handleCryptoSwap(swapPayload) {
    const result = await api.cryptoSwap(swapPayload)
    if (result.newBalance !== undefined) {
      setBalance(result.newBalance)
      setWallet(prev => prev ? {
        ...prev,
        balance: result.newBalance,
        crypto: result.cryptoHoldings || prev.crypto
      } : null)
    }
    if (result.transaction) {
      setTransactions(prev => [result.transaction, ...prev])
    }
    setNotifications(prev => prev + 1)
    triggerIsland({
      title: 'DEX Swap Confirmed',
      subtitle: `${swapPayload.fromAmount} ${swapPayload.fromAsset} swapped to ${swapPayload.toAmount} ${swapPayload.toAsset}`,
      icon: 'crypto',
      color: '#8b5cf6'
    })
    return result
  }

  function handleAddTransaction(newTx) {
    setTransactions(prev => [newTx, ...prev])
    const deltaAmount = newTx.amount / (currency === 'NGN' ? 160 : 1)
    setBalance(prev => Math.max(0, prev + deltaAmount))
    triggerIsland({
      title: newTx.type === 'expense' ? 'Expense Recorded' : 'Income Added',
      subtitle: `${newTx.merchant} (${newTx.category})`,
      icon: 'send',
      color: newTx.color || '#00A884'
    })
  }

  async function handleToggleFreeze() {
    try {
      const res = await api.toggleFreezeCard()
      setWallet(prev => prev ? { ...prev, isFrozen: res.isFrozen } : null)
      triggerIsland({
        title: res.isFrozen ? 'Visa Card Frozen' : 'Visa Card Unlocked',
        subtitle: res.isFrozen ? 'All transactions locked' : 'Ready for tap and chip payments',
        icon: 'card',
        color: res.isFrozen ? '#ef4444' : '#10b981'
      })
    } catch (e) {}
  }

  return (
    <PhoneFrame islandAlert={islandAlert}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', background: '#F8FAF7', position: 'relative', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '220px', pointerEvents: 'none', zIndex: 0, opacity: 0.6 }} viewBox="0 0 393 220" fill="none">
          <path d="M0 0 H393 V100 C300 160 180 60 0 140 Z" fill="url(#brandWaveGrad)" />
          <defs>
            <linearGradient id="brandWaveGrad" x1="0" y1="0" x2="393" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00A884" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#0B3D2E" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#F8FAF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        {!isAuthenticated ? (
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <div style={{ flex: 1, width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
              {activeNav === 'home' && (
                <HomeScreen
                  user={user}
                  wallet={wallet}
                  balance={balance}
                  hidden={hidden}
                  setHidden={setHidden}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  onRecord={() => setShowAddTransactionModal(true)}
                  onOpenGoals={() => setActiveNav('wallet')}
                  onOpenBudgets={() => setShowBudgets(true)}
                  onSelectTx={tx => setSelectedTx(tx)}
                  onViewAll={() => setActiveNav('activity')}
                  transactions={transactions}
                  currency={currency}
                  setCurrency={setCurrency}
                  budgets={budgets}
                  goals={goals}
                  committedBills={45000}
                  committedSavings={activeMonthlyGoalsCommitment}
                />
              )}
              {activeNav === 'activity' && (
                <ActivityScreen
                  transactions={transactions}
                  onSelectTx={tx => setSelectedTx(tx)}
                  onRecord={() => setShowAddTransactionModal(true)}
                  currency={currency}
                />
              )}
              {activeNav === 'wallet' && (
                <GoalsScreen
                  goals={goals}
                  balance={balance}
                  currency={currency}
                  onCreateGoal={handleCreateGoal}
                  onContributeGoal={handleContributeGoal}
                  onDeleteGoal={handleDeleteGoal}
                />
              )}
              {activeNav === 'more' && (
                <MoreScreen
                  user={user}
                  wallet={wallet}
                  onSignOut={handleSignOut}
                  onViewActivity={() => setActiveNav('activity')}
                />
              )}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 32px)',
              maxWidth: '350px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(20px)',
              borderRadius: '30px',
              border: '1px solid rgba(0, 168, 132, 0.18)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              alignItems: 'center',
              padding: '0 4px',
              zIndex: 30
            }}>
              {NAV_ITEMS.map(item => {
                const isActive = activeNav === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className="tap-spring"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      height: '100%',
                      position: 'relative'
                    }}
                  >
                    {item.icon(isActive)}
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: isActive ? '#00A884' : '#94A3B8',
                      letterSpacing: '0.01em'
                    }}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {showTransfer && (
              <TransferModal
                user={user}
                onClose={() => setShowTransfer(false)}
                onTransfer={handleTransfer}
                beneficiaries={beneficiaries}
              />
            )}

            {showTopUp && (
              <TopUpModal
                onClose={() => setShowTopUp(false)}
                onConfirmTopUp={handleConfirmTopUp}
              />
            )}

            {showReceive && (
              <ReceiveModal
                user={user}
                onClose={() => setShowReceive(false)}
              />
            )}

            {showAnalytics && (
              <AnalyticsModal
                balance={balance}
                onClose={() => setShowAnalytics(false)}
              />
            )}

            {selectedTx && (
              <TransactionDetailModal
                tx={selectedTx}
                user={user}
                onClose={() => setSelectedTx(null)}
              />
            )}

            <AddTransactionModal
              isOpen={showAddTransactionModal}
              onClose={() => setShowAddTransactionModal(false)}
              onAddTransaction={handleAddTransaction}
              currency={currency}
            />

            {showBudgets && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
                <BudgetsScreen
                  transactions={transactions}
                  budgets={budgets}
                  currency={currency}
                  onUpdateBudget={handleUpdateBudget}
                  onClose={() => setShowBudgets(false)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </PhoneFrame>
  )
}
