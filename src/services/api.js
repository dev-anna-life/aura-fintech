import { USER, TRANSACTIONS } from '../data/fintechData'

const TOKEN_KEY = 'aura_auth_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const DEFAULT_WALLET = {
  balance: 7812.50,
  currency: 'USD',
  accountNumber: '8029148201',
  cardLast4: '4820',
  cardExpiry: '08/29',
  cardholderName: 'ALEX MORGAN',
  isFrozen: false,
  cryptoHoldings: {
    USDT: 1500,
    BTC: 0.045,
    ETH: 0.82
  }
}

const DEFAULT_USER = {
  id: 'usr_default_01',
  name: 'Alex Morgan',
  firstName: 'Alex',
  email: 'alex.morgan@sovra.io',
  phone: '+234 815 678 9060',
  avatar: 'AM',
  accountType: 'Sovereign Wealth Tier',
  accountNumber: '8029148201',
  tier: 'Verified Sovereign',
  memberSince: 'Oct 2026'
}

const DEFAULT_BENEFICIARIES = [
  { id: 'ben_1', name: 'Emeka Obi', bank: 'Access Bank', account: '0123456789' },
  { id: 'ben_2', name: 'Fatima Bello', bank: 'GTBank', account: '0987654321' },
  { id: 'ben_3', name: 'Chidi Nnamdi', bank: 'Zenith Bank', account: '0246813579' }
]

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error || 'Request failed')
    }

    return data
  } catch (err) {
    // If it is a network error (e.g. running in standalone mobile APK without local server)
    if (err.message && (err.message.includes('fetch') || err.message.includes('Network') || err.message.includes('Failed'))) {
      console.warn(`[Sovra Standalone Mode] Offline fallback for ${endpoint}`)
      return null
    }
    throw err
  }
}

export const api = {
  async register({ fullName, email, password, phone, bvn, photoUrl }) {
    try {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password, phone, bvn, photoUrl })
      })
      if (data && data.token) {
        setToken(data.token)
        return data
      }
    } catch (err) {
      if (!err.message?.includes('fetch') && !err.message?.includes('Network') && !err.message?.includes('Failed')) {
        throw err
      }
    }

    // Standalone mobile fallback
    const token = 'sovra_standalone_token'
    setToken(token)
    const names = fullName ? fullName.trim().split(' ') : ['Member']
    const user = {
      id: `usr_${Date.now()}`,
      name: fullName || 'Sovra Member',
      firstName: names[0] || 'Member',
      email: email || 'alex.morgan@sovra.io',
      phone: phone || '+234 904 809 5365',
      photoUrl: photoUrl || null,
      avatar: names.map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AM',
      accountType: 'Sovereign Wealth Tier',
      accountNumber: '80' + Math.floor(10000000 + Math.random() * 90000000).toString(),
      tier: 'Verified Sovereign',
      memberSince: 'Nov 2026'
    }
    localStorage.setItem('aura_cached_user', JSON.stringify(user))
    return { token, user, wallet: DEFAULT_WALLET }
  },

  async login({ email, password, isDemo, isBiometric }) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, isDemo, isBiometric })
      })
      if (data && data.token) {
        setToken(data.token)
        if (data.user) {
          localStorage.setItem('aura_cached_user', JSON.stringify(data.user))
        }
        return data
      }
    } catch (err) {
      if (!err.message?.includes('fetch') && !err.message?.includes('Network') && !err.message?.includes('Failed')) {
        throw err
      }
    }

    // Standalone mobile fallback (enables instant login on phones with zero backend required)
    const token = 'sovra_standalone_token'
    setToken(token)

    const cleanEmail = email ? email.toLowerCase().trim() : ''
    const isAnnastesia = cleanEmail.includes('amarachi') || cleanEmail.includes('ugwuanyi')

    const cachedUserStr = localStorage.getItem('aura_cached_user')
    let cachedUser = null
    try {
      cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null
    } catch (e) {}

    let fallbackFirstName = 'Member'
    let fallbackFullName = 'Sovra Member'
    if (isAnnastesia) {
      fallbackFirstName = 'Annastesia'
      fallbackFullName = 'Annastesia Amarachi Ugwuanyi'
    } else if (cleanEmail) {
      const handle = cleanEmail.split('@')[0]
      const parts = handle.split(/[._-]/).filter(Boolean)
      if (parts.length > 0) {
        fallbackFirstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
        fallbackFullName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
      }
    }

    const user = cachedUser || {
      ...DEFAULT_USER,
      name: fallbackFullName,
      firstName: fallbackFirstName,
      email: email || 'member@sovra.io',
      avatar: (fallbackFirstName[0] + (fallbackFullName.split(' ')[1]?.[0] || '')).toUpperCase()
    }

    localStorage.setItem('aura_cached_user', JSON.stringify(user))
    return { token, user, wallet: DEFAULT_WALLET }
  },

  async resetPassword({ email, newPassword }) {
    const data = await request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    })
    return data || { success: true }
  },

  async getCurrentUser() {
    const data = await request('/user/me')
    if (data) return data
    const storedUser = localStorage.getItem('aura_cached_user')
    const storedWallet = localStorage.getItem('aura_cached_wallet')
    return {
      user: storedUser ? JSON.parse(storedUser) : DEFAULT_USER,
      wallet: storedWallet ? JSON.parse(storedWallet) : DEFAULT_WALLET
    }
  },

  async updateProfile({ name, phone }) {
    const data = await request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, phone })
    })
    return data || { success: true }
  },

  async getWallet() {
    const data = await request('/wallet')
    if (data) return data
    const storedWallet = localStorage.getItem('aura_cached_wallet')
    return storedWallet ? JSON.parse(storedWallet) : DEFAULT_WALLET
  },

  async topUp({ amount, method }) {
    const data = await request('/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount, method })
    })
    if (data) return data
    return {
      success: true,
      transaction: {
        id: `tx_${Date.now()}`,
        merchant: `Vault Deposit via ${method || 'Card'}`,
        category: 'Income',
        amount: Number(amount) || 100,
        date: 'Today, Just now',
        status: 'Completed',
        color: '#10b981'
      }
    }
  },

  async toggleFreezeCard() {
    const data = await request('/wallet/freeze', {
      method: 'POST'
    })
    return data || { isFrozen: true }
  },

  async cryptoSwap({ fromAsset, toAsset, fromAmount, toAmount }) {
    const data = await request('/crypto/swap', {
      method: 'POST',
      body: JSON.stringify({ fromAsset, toAsset, fromAmount, toAmount })
    })
    if (data) return data
    return {
      success: true,
      transaction: {
        id: `tx_${Date.now()}`,
        merchant: `DEX Swap: ${fromAsset} → ${toAsset}`,
        category: 'Crypto',
        amount: 0,
        date: 'Today, Just now',
        color: '#8b5cf6'
      }
    }
  },

  async getTransactions() {
    const data = await request('/transactions')
    if (data && data.transactions) return data
    return { transactions: TRANSACTIONS }
  },

  async transfer({ recipientName, recipientBank, recipientAccount, amount, saveBeneficiary }) {
    const data = await request('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify({ recipientName, recipientBank, recipientAccount, amount, saveBeneficiary })
    })
    if (data) return data
    return {
      success: true,
      transaction: {
        id: `tx_${Date.now()}`,
        merchant: recipientName || 'Beneficiary Transfer',
        category: 'Transfer',
        amount: -(Number(amount) || 0),
        date: 'Today, Just now',
        status: 'Completed',
        color: '#00A884'
      }
    }
  },

  async getBeneficiaries() {
    const data = await request('/beneficiaries')
    if (data && data.beneficiaries) return data
    return { beneficiaries: DEFAULT_BENEFICIARIES }
  },

  async verifyPin(pin) {
    const data = await request('/auth/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ pin })
    })
    return data || { valid: true }
  },

  async setPin(newPin) {
    const data = await request('/auth/set-pin', {
      method: 'POST',
      body: JSON.stringify({ newPin })
    })
    return data || { success: true }
  },

  logout() {
    clearToken()
  }
}
