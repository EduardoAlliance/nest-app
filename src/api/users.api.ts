import api from './axios'
import type {
  ApiResponse,
  User,
  ApiPaginatedData,
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
  UsersQueryParams,
} from '../types'

export const usersApi = {
  getProfile() {
    return api.get<ApiResponse<User>>('/users/profile')
  },

  updateProfile(data: UpdateProfileDto) {
    return api.patch<ApiResponse<User>>('/users/profile', data)
  },

  getUsers(params?: UsersQueryParams) {
    return api.get<ApiResponse<ApiPaginatedData<User>>>('/users', { params })
  },

  getUser(id: number) {
    return api.get<ApiResponse<User>>(`/users/${id}`)
  },

  createUser(data: CreateUserDto) {
    return api.post<ApiResponse<User>>('/users', data)
  },

  updateUser(id: number, data: UpdateUserDto) {
    return api.patch<ApiResponse<User>>(`/users/${id}`, data)
  },

  deleteUser(id: number) {
    return api.delete<ApiResponse<null>>(`/users/${id}`)
  },

  restoreUser(id: number) {
    return api.post<ApiResponse<User>>(`/users/${id}/restore`)
  },
}
