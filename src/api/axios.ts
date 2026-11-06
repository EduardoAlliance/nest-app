import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/auth.store'
import type { ApiResponse, RefreshResponse } from '../types'

export const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Cliente sin interceptores para llamar a /auth/refresh. Evita bucles de
 * reintento si el propio refresh devuelve 401.
 */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Refresh single-flight: si varias peticiones reciben 401 a la vez, todas
 * comparten la misma promesa de refresh.
 */
let refreshPromise: Promise<string> | null = null

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiResponse<RefreshResponse>>('/auth/refresh')
      .then(({ data }) => {
        const accessToken = data.data.accessToken
        useAuthStore.getState().setAccessToken(accessToken)
        return accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
]

function redirectToLogin() {
  if (typeof window === 'undefined') return
  if (AUTH_ROUTES.includes(window.location.pathname)) return
  window.location.assign('/login')
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    const isAuthRequest = originalRequest?.url?.includes('/auth/') ?? false

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const accessToken = await refreshAccessToken()
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      useAuthStore.getState().reset()
      redirectToLogin()
      return Promise.reject(refreshError)
    }
  },
)

export default api
