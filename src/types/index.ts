export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  statusCode?: number
  message?: string
  timestamp?: string
  path?: string
}

export interface ApiPaginatedData<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export const ROLES = ['admin', 'moderator', 'user'] as const
export type Role = (typeof ROLES)[number]

/**
 * Datos mínimos que devuelve el backend al iniciar sesión.
 */
export interface SessionUser {
  id: number
  email: string
  name: string
  phone?: string | null
  role: Role
  emailVerified: boolean
}

/**
 * Usuario completo que devuelve GET /users/profile y GET /users.
 */
export interface User extends SessionUser {
  phone: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: SessionUser
}

export interface RefreshResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  name: string
  password: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  password: string
}

export interface UpdateProfileDto {
  name?: string
  phone?: string | null
  currentPassword?: string
  password?: string
}

export interface CreateUserDto {
  email: string
  name: string
  password: string
  role?: Role
}

export interface UpdateUserDto {
  email?: string
  name?: string
  password?: string
  role?: Role
}

export interface UsersQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  isActive?: boolean
}
