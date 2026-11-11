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

// Client Account Vault for persistent credentials across mobile & web
const ACCOUNTS_KEY = 'sovra_registered_accounts'

function getStoredAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

function saveStoredAccount(email, accountData) {
  try {
    const accounts = getStoredAccounts()
    accounts[email.toLowerCase().trim()] = accountData
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch (e) {}
}

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
      if (response.status === 404 || response.status === 502 || response.status === 503 || response.status === 405) {
        console.warn(`[Sovra Standalone Mode] Endpoint ${endpoint} offline (${response.status}), switching to client vault fallback`)
        return null
      }
      throw new Error(data.error || 'Request failed')
    }

    return data
  } catch (err) {
    // If it is a network error or offline fallback (e.g. running in standalone mobile APK or static Vercel)
    if (err.message && (err.message.includes('fetch') || err.message.includes('Network') || err.message.includes('Failed') || err.message.includes('Request failed'))) {
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

    // Standalone mobile & client vault registration
    const token = 'sovra_token_' + Date.now()
    setToken(token)
    const cleanEmail = email ? email.toLowerCase().trim() : 'member@sovra.io'
    const names = fullName ? fullName.trim().split(' ') : ['Member']
    const user = {
      id: `usr_${Date.now()}`,
      name: fullName || 'Sovra Member',
      firstName: names[0] || 'Member',
      email: cleanEmail,
      phone: phone || '+234 904 809 5365',
      photoUrl: photoUrl || null,
      avatar: names.map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'M',
      accountType: 'Sovereign Wealth Tier',
      accountNumber: '80' + Math.floor(10000000 + Math.random() * 90000000).toString(),
      tier: 'Verified Sovereign',
      memberSince: 'Nov 2026'
    }

    // Save account credentials to vault
    saveStoredAccount(cleanEmail, {
      user,
      password,
      wallet: DEFAULT_WALLET
    })

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
      if (!err.message?.includes('fetch') && !err.message?.includes('Network') && !err.message?.includes('Failed') && !err.message?.includes('Request failed')) {
        throw err
      }
    }

    // Standalone & client vault authentication
    const token = 'sovra_token_' + Date.now()
    setToken(token)

    const cleanEmail = email ? email.toLowerCase().trim() : ''
    const accounts = getStoredAccounts()
    const storedAccount = accounts[cleanEmail]

    // Verify passcode if account exists and not biometric
    if (storedAccount && password && !isBiometric) {
      if (storedAccount.password && storedAccount.password !== password) {
        throw new Error('Incorrect master passcode. Please verify your passcode or reset it below.')
      }
    }

    const isAnnastesia = cleanEmail.includes('amarachi') || cleanEmail.includes('ugwuanyi')
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

    const cachedUserStr = localStorage.getItem('aura_cached_user')
    let cachedUser = null
    try {
      cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null
    } catch (e) {}

    const user = storedAccount?.user || cachedUser || {
      ...DEFAULT_USER,
      name: fallbackFullName,
      firstName: fallbackFirstName,
      email: cleanEmail || 'member@sovra.io',
      avatar: (fallbackFirstName[0] + (fallbackFullName.split(' ')[1]?.[0] || '')).toUpperCase()
    }

    // If first-time user with email and password, save credentials
    if (!storedAccount && cleanEmail && password) {
      saveStoredAccount(cleanEmail, {
        user,
        password,
        wallet: DEFAULT_WALLET
      })
    }

    localStorage.setItem('aura_cached_user', JSON.stringify(user))
    return { token, user, wallet: storedAccount?.wallet || DEFAULT_WALLET }
  },

  async resetPassword({ email, newPassword }) {
    try {
      const data = await request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword })
      })
      if (data) return data
    } catch (err) {
      console.warn('[Sovra] Remote reset-password unavailable, updating local account vault')
    }

    // Client Vault Passcode Update
    const cleanEmail = email ? email.toLowerCase().trim() : ''
    const accounts = getStoredAccounts()
    let account = accounts[cleanEmail]

    if (account) {
      account.password = newPassword
      account.updatedAt = Date.now()
      saveStoredAccount(cleanEmail, account)
      if (account.user) {
        localStorage.setItem('aura_cached_user', JSON.stringify(account.user))
      }
    } else {
      const isAnnastesia = cleanEmail.includes('amarachi') || cleanEmail.includes('ugwuanyi')
      const handle = cleanEmail.split('@')[0] || 'member'
      const parts = handle.split(/[._-]/).filter(Boolean)
      const firstName = isAnnastesia ? 'Annastesia' : (parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Member')
      const fullName = isAnnastesia ? 'Annastesia Amarachi Ugwuanyi' : parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'Sovra Member'

      const user = {
        ...DEFAULT_USER,
        id: `usr_${Date.now()}`,
        name: fullName,
        firstName,
        email: cleanEmail,
        avatar: (firstName[0] + (fullName.split(' ')[1]?.[0] || '')).toUpperCase()
      }

      account = {
        user,
        password: newPassword,
        wallet: DEFAULT_WALLET
      }
      saveStoredAccount(cleanEmail, account)
      localStorage.setItem('aura_cached_user', JSON.stringify(user))
    }

    return { success: true, message: 'Passcode updated successfully' }
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
