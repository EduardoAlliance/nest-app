import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users.api'
import { useAuthStore } from '../store/auth.store'
import toast from 'react-hot-toast'
import type {
  UsersQueryParams,
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
} from '../types'

export function useUsers(params?: UsersQueryParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await usersApi.getUsers(params)
      const payload = data.data
      const totalPages = Math.ceil(payload.total / payload.limit)

      return {
        items: payload.data,
        meta: {
          total: payload.total,
          page: payload.page,
          limit: payload.limit,
          totalPages,
          hasNextPage: payload.page < totalPages,
          hasPreviousPage: payload.page > 1,
        },
      }
    },
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await usersApi.getProfile()
      useAuthStore.getState().setUser(data.data)
      return data.data
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => usersApi.updateProfile(data),
    onSuccess: ({ data }) => {
      useAuthStore.getState().setUser(data.data)
      queryClient.setQueryData(['profile'], data.data)
      toast.success('Perfil actualizado')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar perfil'
      toast.error(message)
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario creado exitosamente')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear usuario'
      toast.error(message)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario actualizado')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar usuario'
      toast.error(message)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario eliminado')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar usuario'
      toast.error(message)
    },
  })
}

export function useRestoreUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usersApi.restoreUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario restaurado')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al restaurar usuario'
      toast.error(message)
    },
  })
}
