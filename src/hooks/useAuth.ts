import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { usersApi } from '../api/users.api'
import { useAuthStore } from '../store/auth.store'
import toast from 'react-hot-toast'
import type { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '../types'

export function useAuthStatus() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  return { accessToken, isAuthenticated, isInitialized }
}

export function useSession() {
  const { user, isAuthenticated, isInitialized, accessToken } = useAuthStore()
  const setUser = useAuthStore((s) => s.setUser)
  const setInitialized = useAuthStore((s) => s.setInitialized)

  const { isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const { data } = await usersApi.getProfile()
        setUser(data.data)
        return data.data
      } catch {
        setUser(null)
        return null
      } finally {
        setInitialized(true)
      }
    },
    enabled: !!accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  if (!accessToken && !isInitialized) {
    setInitialized(true)
  }

  return { user, isAuthenticated, isLoading: isLoading || !isInitialized }
}

export function useLogin() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: async ({ data }) => {
      const tokens = data.data as { accessToken: string; refreshToken: string; user?: any }
      setTokens(tokens.accessToken, tokens.refreshToken)
      if (tokens.user) setUser(tokens.user)
      toast.success('Inicio de sesión exitoso')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al iniciar sesión'
      toast.error(message)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: () => {
      toast.success('Revisa tu email para verificar la cuenta')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al registrarse'
      toast.error(message)
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { reset } = useAuthStore()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      reset()
      queryClient.clear()
      navigate('/login')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordDto) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success('Revisa tu email para restablecer la contraseña')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al solicitar restablecimiento'
      toast.error(message)
    },
  })
}

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: ResetPasswordDto) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Contraseña restablecida exitosamente')
      navigate('/login')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al restablecer la contraseña'
      toast.error(message)
    },
  })
}
