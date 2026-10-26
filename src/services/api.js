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

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const api = {
  async register({ fullName, email, password, phone, bvn, photoUrl }) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, phone, bvn, photoUrl })
    })
    if (data.token) setToken(data.token)
    return data
  },

  async login({ email, password, isDemo }) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, isDemo })
    })
    if (data.token) setToken(data.token)
    return data
  },

  async resetPassword({ email, newPassword }) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    })
  },

  async getCurrentUser() {
    return request('/user/me')
  },

  async updateProfile({ name, phone }) {
    return request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, phone })
    })
  },

  async getWallet() {
    return request('/wallet')
  },

  async topUp({ amount, method }) {
    return request('/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount, method })
    })
  },

  async toggleFreezeCard() {
    return request('/wallet/freeze', {
      method: 'POST'
    })
  },

  async cryptoSwap({ fromAsset, toAsset, fromAmount, toAmount }) {
    return request('/crypto/swap', {
      method: 'POST',
      body: JSON.stringify({ fromAsset, toAsset, fromAmount, toAmount })
    })
  },

  async getTransactions() {
    return request('/transactions')
  },

  async transfer({ recipientName, recipientBank, recipientAccount, amount, saveBeneficiary }) {
    return request('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify({ recipientName, recipientBank, recipientAccount, amount, saveBeneficiary })
    })
  },

  async getBeneficiaries() {
    return request('/beneficiaries')
  },

  async verifyPin(pin) {
    return request('/auth/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ pin })
    })
  },

  async setPin(newPin) {
    return request('/auth/set-pin', {
      method: 'POST',
      body: JSON.stringify({ newPin })
    })
  },

  logout() {
    clearToken()
  }
}
