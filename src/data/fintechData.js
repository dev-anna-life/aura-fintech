export const USER = {
  name: 'Alex Morgan',
  firstName: 'Alex',
  avatar: 'AM',
  balance: 12480.87,
  cardNumber: '•••• •••• •••• 8821',
  cardHolder: 'ALEX MORGAN',
  expiry: '08/29',
  cvv: '492',
  cardType: 'Visa Infinite',
  accountType: 'Premium'
}

export const SUPPORTED_BANKS = [
  'Aura Tag / Direct',
  'Kuda Bank',
  'OPay',
  'Moniepoint',
  'Access Bank',
  'GTBank',
  'Zenith Bank',
  'Chase Bank',
  'Barclays'
]

export const TRANSACTIONS = [
  {
    id: 1,
    merchant: 'Netflix',
    icon: 'N',
    category: 'Subscription',
    amount: -14.99,
    date: 'Today, 9:14 AM',
    color: '#e50914'
  },
  {
    id: 2,
    merchant: 'Salary Credit',
    icon: 'SC',
    category: 'Income',
    amount: 3200.00,
    date: 'Yesterday, 12:00 PM',
    color: '#10b981'
  },
  {
    id: 3,
    merchant: 'Shoprite',
    icon: 'SR',
    category: 'Grocery',
    amount: -87.40,
    date: 'Yesterday, 3:45 PM',
    color: '#f59e0b'
  },
  {
    id: 4,
    merchant: 'Uber',
    icon: 'U',
    category: 'Transport',
    amount: -12.00,
    date: 'Mon, 8:20 AM',
    color: '#000000'
  },
  {
    id: 5,
    merchant: 'Apple Store',
    icon: 'A',
    category: 'Tech',
    amount: -129.00,
    date: 'Sun, 2:05 PM',
    color: '#6b7280'
  }
]

export const BUDGET_CATEGORIES = [
  { label: 'Dining', spent: 240, total: 400, color: '#f97316' },
  { label: 'Tech', spent: 310, total: 500, color: '#8b5cf6' },
  { label: 'Subscriptions', spent: 89, total: 120, color: '#ec4899' },
  { label: 'Transport', spent: 65, total: 200, color: '#06b6d4' }
]

export const CONTACTS = []

export function formatTransactionDate(tx) {
  if (!tx) return ''
  const timestamp = tx.timestamp || (typeof tx.id === 'number' && tx.id > 1700000000000 ? tx.id : null)
  if (!timestamp) return tx.date || 'Recent'

  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return tx.date || 'Recent'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  const isToday = now.toDateString() === date.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = yesterday.toDateString() === date.toDateString()

  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  if (isToday) {
    if (diffMins < 5) return 'Just now'
    if (diffMins < 60) return diffMins + 'm ago'
    return 'Today, ' + timeStr
  }

  if (isYesterday) {
    return 'Yesterday, ' + timeStr
  }

  const dayDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (dayDiff < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    return dayName + ', ' + timeStr
  }

  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + timeStr
}

