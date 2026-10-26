import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, 'data.json')

const INITIAL_DATA = {
  users: [
    {
      id: 'usr_default_01',
      name: 'Alex Morgan',
      firstName: 'Alex',
      email: 'alex.morgan@aura.io',
      phone: '+1 (555) 392-1082',
      passwordHash: '$2a$10$w8T9/vY7E5kKkQZ8x4Lq2.5x5j4Q8rU7p5x8x8x8x8x8x8x8x8x8x',
      avatar: 'AM',
      accountType: 'Premium Tier',
      accountNumber: '8029148201',
      tier: 'Verified Platinum',
      memberSince: 'Sep 2026',
      createdAt: '2026-09-01T08:00:00.000Z'
    }
  ],
  wallets: [
    {
      userId: 'usr_default_01',
      balance: 12480.87,
      savingsVault: 4200.00,
      investmentPortfolio: 8840.12,
      cardNumber: '4829 •••• •••• 8821',
      cardHolder: 'ALEX MORGAN',
      expiry: '08/29',
      cvv: '492',
      cardType: 'Visa Infinite'
    }
  ],
  transactions: [
    {
      id: 1,
      userId: 'usr_default_01',
      merchant: 'Netflix',
      icon: 'N',
      category: 'Subscription',
      amount: -14.99,
      date: 'Today, 9:14 AM',
      color: '#e50914'
    },
    {
      id: 2,
      userId: 'usr_default_01',
      merchant: 'Salary Credit',
      icon: 'SC',
      category: 'Income',
      amount: 3200.00,
      date: 'Yesterday, 12:00 PM',
      color: '#10b981'
    },
    {
      id: 3,
      userId: 'usr_default_01',
      merchant: 'Shoprite',
      icon: 'SR',
      category: 'Grocery',
      amount: -87.40,
      date: 'Yesterday, 3:45 PM',
      color: '#f59e0b'
    },
    {
      id: 4,
      userId: 'usr_default_01',
      merchant: 'Uber',
      icon: 'U',
      category: 'Transport',
      amount: -12.00,
      date: 'Mon, 8:20 AM',
      color: '#000000'
    },
    {
      id: 5,
      userId: 'usr_default_01',
      merchant: 'Apple Store',
      icon: 'A',
      category: 'Tech',
      amount: -129.00,
      date: 'Sun, 2:05 PM',
      color: '#6b7280'
    }
  ],
  beneficiaries: [
    { id: 1, userId: 'usr_default_01', name: 'Sarah K.', initials: 'SK', bank: 'Kuda Bank', account: '2049182390', color: '#8b5cf6' },
    { id: 2, userId: 'usr_default_01', name: 'David O.', initials: 'DO', bank: 'Access Bank', account: '0129482711', color: '#f97316' },
    { id: 3, userId: 'usr_default_01', name: 'Amina B.', initials: 'AB', bank: 'GTBank', account: '0812948192', color: '#10b981' },
    { id: 4, userId: 'usr_default_01', name: 'James T.', initials: 'JT', bank: 'Zenith Bank', account: '2281940192', color: '#ec4899' },
    { id: 5, userId: 'usr_default_01', name: 'Leila M.', initials: 'LM', bank: 'OPay', account: '8129401920', color: '#06b6d4' }
  ]
}

export function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8')
      return JSON.parse(JSON.stringify(INITIAL_DATA))
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    return JSON.parse(JSON.stringify(INITIAL_DATA))
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    return false
  }
}
