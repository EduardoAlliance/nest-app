import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { usersApi } from '../api/users.api'
import { refreshAccessToken } from '../api/axios'
import { useAuthStore } from '../store/auth.store'
import toast from 'react-hot-toast'
import type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../types'

/**
 * Restaura la sesión al montar la app:
 * 1. Pide un access token nuevo con la cookie HttpOnly (POST /auth/refresh).
 * 2. Carga el perfil completo con ese token.
 * 3. Si el refresh falla, deja la sesión vacía y marca la app como inicializada.
 */
export function useSession() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  const { isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        if (!useAuthStore.getState().accessToken) {
          await refreshAccessToken()
        }

        const { data } = await usersApi.getProfile()
        useAuthStore.getState().setUser(data.data)
        queryClient.setQueryData(['profile'], data.data)
        return data.data
      } catch {
        useAuthStore.getState().setUser(null)
        return null
      } finally {
        useAuthStore.getState().setInitialized(true)
      }
    },
    enabled: !isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  return {
    user,
    isAuthenticated,
    isLoading: !isInitialized || isLoading,
  }
}

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: ({ data }) => {
      const { accessToken, user } = data.data
      useAuthStore.getState().setSession(accessToken, user)
      queryClient.setQueryData(['session'], user)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Inicio de sesión exitoso')
      navigate('/dashboard', { replace: true })
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
      toast.success('Cuenta creada. Revisa tu email para verificarla.')
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

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      useAuthStore.getState().reset()
      queryClient.clear()
      navigate('/login', { replace: true })
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
      const message =
        error.response?.data?.message || 'Error al solicitar restablecimiento'
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
      navigate('/login', { replace: true })
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Error al restablecer la contraseña'
      toast.error(message)
    },
  })
}

export function useVerifyEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { token: string }) => authApi.verifyEmail(data),
    onSuccess: async () => {
      toast.success('Email verificado correctamente')
      queryClient.invalidateQueries({ queryKey: ['profile'] })

      // Si había una sesión activa, refresca el usuario para reflejar
      // emailVerified sin obligar a recargar la página.
      if (useAuthStore.getState().accessToken) {
        try {
          const { data } = await usersApi.getProfile()
          useAuthStore.getState().setUser(data.data)
          queryClient.setQueryData(['profile'], data.data)
        } catch {
          /* la verificación ya se completó; el perfil se reintentará luego */
        }
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        'El enlace de verificación no es válido o expiró'
      toast.error(message)
    },
  })
}
