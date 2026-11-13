import { USER, TRANSACTIONS } from '../data/fintechData'
import { supabase, isSupabaseConfigured } from './supabaseClient'

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
  balance: 9475,
  currency: 'USD',
  accountNumber: '8029148201',
  cardLast4: '4820',
  cardExpiry: '08/29',
  cardholderName: 'UGWUANYI A. AMARACHI',
  isFrozen: false,
  cryptoHoldings: {
    USDT: 1500,
    BTC: 0.045,
    ETH: 0.82
  }
}

const DEFAULT_USER = {
  id: 'usr_default_01',
  name: 'Ugwuanyi Annastesia Amarachi',
  firstName: 'Ugwuanyi',
  email: 'ugwuanyiannastesiaa@gmail.com',
  phone: '+234 904 809 5365',
  avatar: 'UA',
  photoUrl: 'https://fotphofqwzpcfyxsziip.supabase.co/storage/v1/object/public/avatars/user_1794563869305.jpeg',
  accountType: 'Sovereign Wealth Tier',
  accountNumber: '8029148201',
  tier: 'Standard Tier',
  memberSince: 'Nov 2026'
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

const CLOUD_AVATAR = 'https://fotphofqwzpcfyxsziip.supabase.co/storage/v1/object/public/avatars/user_1794563869305.jpeg'

function getActivePhoto(userPhoto) {
  if (userPhoto && typeof userPhoto === 'string') {
    return userPhoto
  }
  try {
    const registeredFace = typeof localStorage !== 'undefined' ? localStorage.getItem('aura_registered_face') : null
    if (registeredFace) return registeredFace
  } catch (e) {}
  return CLOUD_AVATAR
}

function getPrimaryStoredUser() {
  // Check if any account in the vault has a user with a registered name
  try {
    const accounts = getStoredAccounts()
    for (const key of Object.keys(accounts)) {
      const u = accounts[key]?.user
      if (u && u.name && !u.name.toLowerCase().includes('default') && !u.name.toLowerCase().includes('alex')) {
        return u
      }
    }
  } catch (e) {}

  // Check aura_cached_user
  try {
    const cached = localStorage.getItem('aura_cached_user')
    if (cached) {
      const u = JSON.parse(cached)
      if (u && u.name && !u.name.toLowerCase().includes('default') && !u.name.toLowerCase().includes('alex')) {
        return u
      }
    }
  } catch (e) {}

  return null
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

async function uploadAvatarToSupabase(userId, dataUrl) {
  if (!isSupabaseConfigured || !supabase || !dataUrl || !dataUrl.startsWith('data:')) return dataUrl
  try {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const fileExt = dataUrl.split(';')[0].split('/')[1] || 'jpeg'
    const fileName = `${userId || 'user'}_${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('avatars').upload(fileName, blob, {
      contentType: `image/${fileExt}`,
      upsert: true
    })
    if (error) throw error
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
    return publicUrlData.publicUrl
  } catch (e) {
    console.warn('[Sovra Storage] Avatar upload fallback to dataUrl:', e.message)
    return dataUrl
  }
}

export const api = {
  async register({ fullName, email, password, phone, bvn, photoUrl }) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: supaData, error: supaErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName,
              first_name: fullName ? fullName.trim().split(' ')[0] : 'Ugwuanyi',
              phone,
              bvn,
              photo_url: photoUrl || null
            }
          }
        })
        if (supaErr) throw supaErr
        if (supaData && supaData.user) {
          const token = supaData.session?.access_token || 'sovra_token_' + Date.now()
          setToken(token)
          const meta = supaData.user.user_metadata || {}
          const names = (meta.full_name || fullName || '').trim().split(' ')
          const activePhoto = getActivePhoto(photoUrl || meta.photo_url)
          const user = {
            id: supaData.user.id,
            name: meta.full_name || fullName || 'Ugwuanyi Annastesia Amarachi',
            firstName: meta.first_name || names[0] || 'Ugwuanyi',
            email: supaData.user.email || email.trim(),
            phone: meta.phone || phone || '+234 904 809 5365',
            photoUrl: activePhoto,
            avatar: names.map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'UA',
            accountType: 'Sovereign Wealth Tier',
            accountNumber: '80' + Math.floor(10000000 + Math.random() * 90000000).toString(),
            tier: bvn ? 'Tier 1' : 'Standard Tier',
            memberSince: 'Nov 2026'
          }
          saveStoredAccount(user.email, { user, password, wallet: DEFAULT_WALLET })
          localStorage.setItem('aura_cached_user', JSON.stringify(user))
          return { token, user, wallet: DEFAULT_WALLET }
        }
      } catch (err) {
        console.warn('[Sovra Supabase] Registration fallback to local vault:', err.message)
      }
    }

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
    const cleanEmail = email ? email.toLowerCase().trim() : 'annastesia@sovra.io'
    const names = fullName ? fullName.trim().split(' ') : ['Ugwuanyi']
    const activePhoto = getActivePhoto(photoUrl)
    const user = {
      id: `usr_${Date.now()}`,
      name: fullName || 'Ugwuanyi Annastesia Amarachi',
      firstName: names[0] || 'Ugwuanyi',
      email: cleanEmail,
      phone: phone || '+234 904 809 5365',
      photoUrl: activePhoto,
      avatar: names.map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'UA',
      accountType: 'Sovereign Wealth Tier',
      accountNumber: '80' + Math.floor(10000000 + Math.random() * 90000000).toString(),
      tier: 'Standard Tier',
      memberSince: 'Nov 2026'
    }

    if (activePhoto) {
      localStorage.setItem('aura_registered_face', activePhoto)
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
    if (isSupabaseConfigured && supabase && !isBiometric) {
      try {
        const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })
        if (supaErr) throw supaErr
        if (supaData && supaData.session) {
          setToken(supaData.session.access_token)
          const meta = supaData.user?.user_metadata || {}
          const names = meta.full_name ? meta.full_name.trim().split(' ') : ['Ugwuanyi']
          const activePhoto = getActivePhoto(meta.photo_url)
          const user = {
            id: supaData.user.id,
            name: meta.full_name || 'Ugwuanyi Annastesia Amarachi',
            firstName: meta.first_name || names[0] || 'Ugwuanyi',
            email: supaData.user.email,
            phone: meta.phone || '+234 904 809 5365',
            photoUrl: activePhoto,
            avatar: (names[0]?.[0] || 'U') + (names[1]?.[0] || 'A'),
            accountType: 'Sovereign Wealth Tier',
            accountNumber: '80' + (supaData.user.id.replace(/\D/g, '') + '12345678').slice(0, 8),
            tier: meta.bvn ? 'Tier 1' : 'Standard Tier',
            memberSince: 'Nov 2026'
          }
          if (activePhoto) {
            localStorage.setItem('aura_registered_face', activePhoto)
          }
          localStorage.setItem('aura_cached_user', JSON.stringify(user))
          saveStoredAccount(user.email, { user, password, wallet: DEFAULT_WALLET })
          return { token: supaData.session.access_token, user, wallet: DEFAULT_WALLET }
        }
      } catch (err) {
        console.warn('[Sovra Supabase] Login fallback to local vault:', err.message)
      }
    }

    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, isDemo, isBiometric })
      })
      if (data && data.token) {
        setToken(data.token)
        if (data.user) {
          data.user.photoUrl = getActivePhoto(data.user.photoUrl)
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

    const existingPrimary = getPrimaryStoredUser()
    const activePhoto = getActivePhoto(storedAccount?.user?.photoUrl || existingPrimary?.photoUrl)

    let user
    if (storedAccount?.user) {
      user = {
        ...storedAccount.user,
        photoUrl: activePhoto || storedAccount.user.photoUrl
      }
    } else if (existingPrimary) {
      user = {
        ...existingPrimary,
        email: cleanEmail || existingPrimary.email,
        photoUrl: activePhoto || existingPrimary.photoUrl
      }
    } else {
      const isAnnastesia = cleanEmail.includes('amarachi') || cleanEmail.includes('ugwuanyi') || cleanEmail.includes('anna')
      let firstName = 'Ugwuanyi'
      let fullName = 'Ugwuanyi Annastesia Amarachi'

      if (!isAnnastesia && cleanEmail) {
        const handle = cleanEmail.split('@')[0]
        const parts = handle.split(/[._-]/).filter(Boolean)
        if (parts.length > 0) {
          firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
          fullName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
        }
      }

      user = {
        ...DEFAULT_USER,
        name: fullName,
        firstName: firstName,
        email: cleanEmail || 'annastesia@sovra.io',
        photoUrl: activePhoto,
        avatar: (firstName[0] + (fullName.split(' ')[1]?.[0] || 'A')).toUpperCase()
      }
    }

    // Save/update credentials
    saveStoredAccount(cleanEmail, {
      user,
      password: password || storedAccount?.password || 'default',
      wallet: storedAccount?.wallet || DEFAULT_WALLET
    })

    localStorage.setItem('aura_cached_user', JSON.stringify(user))
    return { token, user, wallet: storedAccount?.wallet || DEFAULT_WALLET }
  },

  async resetPassword({ email, newPassword }) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.resetPasswordForEmail(email.trim())
      } catch (err) {
        console.warn('[Sovra Supabase] Reset password fallback:', err.message)
      }
    }

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

    const existingPrimary = getPrimaryStoredUser()
    const activePhoto = getActivePhoto(account?.user?.photoUrl || existingPrimary?.photoUrl)

    if (account) {
      account.password = newPassword
      account.updatedAt = Date.now()
      if (account.user) {
        account.user.photoUrl = activePhoto || account.user.photoUrl
        localStorage.setItem('aura_cached_user', JSON.stringify(account.user))
      }
      saveStoredAccount(cleanEmail, account)
    } else {
      const baseUser = existingPrimary || DEFAULT_USER
      const isAnnastesia = cleanEmail.includes('amarachi') || cleanEmail.includes('ugwuanyi') || cleanEmail.includes('anna')

      let firstName = baseUser.firstName || 'Ugwuanyi'
      let fullName = baseUser.name || 'Ugwuanyi Annastesia Amarachi'

      if (!isAnnastesia && !existingPrimary && cleanEmail) {
        const handle = cleanEmail.split('@')[0]
        const parts = handle.split(/[._-]/).filter(Boolean)
        if (parts.length > 0) {
          firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
          fullName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
        }
      }

      const user = {
        ...baseUser,
        name: fullName,
        firstName: firstName,
        email: cleanEmail,
        photoUrl: activePhoto || baseUser.photoUrl,
        avatar: (firstName[0] + (fullName.split(' ')[1]?.[0] || 'A')).toUpperCase()
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
    if (data && data.user) {
      data.user.photoUrl = getActivePhoto(data.user.photoUrl)
      return data
    }
    const storedUser = localStorage.getItem('aura_cached_user')
    const storedWallet = localStorage.getItem('aura_cached_wallet')
    let parsedUser = null
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : getPrimaryStoredUser() || DEFAULT_USER
    } catch (e) {
      parsedUser = getPrimaryStoredUser() || DEFAULT_USER
    }
    if (parsedUser) {
      if (parsedUser.firstName === 'Annastesia' || parsedUser.firstName === 'Anna' || !parsedUser.firstName) {
        parsedUser.firstName = 'Ugwuanyi'
      }
      if (!parsedUser.name || parsedUser.name.toLowerCase().includes('alex')) {
        parsedUser.name = 'Ugwuanyi Annastesia Amarachi'
      }
      parsedUser.photoUrl = getActivePhoto(parsedUser.photoUrl)
      try {
        localStorage.setItem('aura_cached_user', JSON.stringify(parsedUser))
      } catch (e) {}
    }
    return {
      user: parsedUser,
      wallet: storedWallet ? JSON.parse(storedWallet) : DEFAULT_WALLET
    }
  },

  async updateProfile({ name, firstName, phone, photoUrl }) {
    let cloudPhotoUrl = photoUrl
    if (photoUrl && photoUrl.startsWith('data:') && isSupabaseConfigured && supabase) {
      try {
        const currentUser = (await supabase.auth.getUser())?.data?.user
        cloudPhotoUrl = await uploadAvatarToSupabase(currentUser?.id, photoUrl)
      } catch (e) {
        console.warn('[Sovra Supabase] Photo upload fallback:', e)
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: name,
            first_name: firstName,
            phone,
            photo_url: cloudPhotoUrl || photoUrl
          }
        })
      } catch (err) {
        console.warn('[Sovra Supabase] Update profile fallback:', err.message)
      }
    }

    try {
      await request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone })
      })
    } catch (e) {}

    const existingStr = localStorage.getItem('aura_cached_user')
    let existing = {}
    try {
      existing = existingStr ? JSON.parse(existingStr) : {}
    } catch (e) {}

    const activePhoto = getActivePhoto(cloudPhotoUrl || photoUrl)
    const updatedUser = {
      ...DEFAULT_USER,
      ...existing,
      ...(name ? { name } : {}),
      ...(firstName ? { firstName } : {}),
      ...(phone ? { phone } : {}),
      ...(activePhoto !== undefined ? { photoUrl: activePhoto } : {})
    }

    if (activePhoto) {
      localStorage.setItem('aura_registered_face', activePhoto)
    }
    localStorage.setItem('aura_cached_user', JSON.stringify(updatedUser))

    if (updatedUser.email) {
      const accounts = getStoredAccounts()
      const cleanEmail = updatedUser.email.toLowerCase().trim()
      if (accounts[cleanEmail]) {
        accounts[cleanEmail].user = updatedUser
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
      }
    }
    return { success: true, user: updatedUser }
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
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {})
    }
  }
}
