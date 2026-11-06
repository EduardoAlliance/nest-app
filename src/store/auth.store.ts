import { create } from 'zustand'
import type { SessionUser } from '../types'

/**
 * El access token vive únicamente en memoria (nunca en localStorage).
 * El refresh token vive en una cookie HttpOnly controlada por el backend.
 */
interface AuthState {
  user: SessionUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  setUser: (user: SessionUser | null) => void
  setAccessToken: (token: string | null) => void
  setSession: (accessToken: string, user: SessionUser) => void
  setInitialized: (value: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setSession: (accessToken, user) =>
    set({ accessToken, user, isAuthenticated: true, isInitialized: true }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  reset: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    }),
}))
