import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (token: string) => void
  setAuthenticated: (value: boolean) => void
  setInitialized: (value: boolean) => void
  reset: () => void
}

function loadTokens() {
  try {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    }
  } catch {
    return { accessToken: null, refreshToken: null }
  }
}

function saveTokens(accessToken: string, refreshToken: string) {
  try {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  } catch { /* noop */ }
}

function clearTokens() {
  try {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  } catch { /* noop */ }
}

const initialTokens = loadTokens()

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: initialTokens.accessToken,
  refreshToken: initialTokens.refreshToken,
  isAuthenticated: !!initialTokens.accessToken,
  isInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setTokens: (accessToken, refreshToken) => {
    saveTokens(accessToken, refreshToken)
    set({ accessToken, refreshToken, isAuthenticated: true })
  },
  setAccessToken: (token) => {
    try { localStorage.setItem('accessToken', token) } catch { /* noop */ }
    set({ accessToken: token })
  },
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setInitialized: (value) => set({ isInitialized: value }),
  reset: () => {
    clearTokens()
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
  },
}))
