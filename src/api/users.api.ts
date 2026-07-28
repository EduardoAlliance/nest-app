import api from './axios'
import type {
  ApiResponse,
  User,
  PaginatedData,
  CreateUserDto,
  UpdateUserDto,
  UsersQueryParams,
} from '../types'

export const usersApi = {
  getProfile() {
    return api.get<ApiResponse<User>>('/users/profile')
  },

  updateProfile(data: { name?: string; email?: string }) {
    return api.patch<ApiResponse<User>>('/users/profile', data)
  },

  getUsers(params?: UsersQueryParams) {
    return api.get<ApiResponse<PaginatedData<User>>>('/users', { params })
  },

  getUser(id: string) {
    return api.get<ApiResponse<User>>(`/users/${id}`)
  },

  createUser(data: CreateUserDto) {
    return api.post<ApiResponse<User>>('/users', data)
  },

  updateUser(id: string, data: UpdateUserDto) {
    return api.patch<ApiResponse<User>>(`/users/${id}`, data)
  },

  deleteUser(id: string) {
    return api.delete<ApiResponse<null>>(`/users/${id}`)
  },

  restoreUser(id: string) {
    return api.post<ApiResponse<User>>(`/users/${id}/restore`)
  },
}
