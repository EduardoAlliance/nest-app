export interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  timestamp: string
  path: string
  data: T
}

export interface PaginatedData<T> {
  items: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'moderator' | 'user'
  isActive: boolean
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
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

export interface CreateUserDto {
  email: string
  name: string
  password: string
  role?: 'admin' | 'moderator' | 'user'
}

export interface UpdateUserDto {
  email?: string
  name?: string
  password?: string
  role?: 'admin' | 'moderator' | 'user'
}

export interface UsersQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  isActive?: boolean
}

export const ROLES = ['admin', 'moderator', 'user'] as const
export type Role = (typeof ROLES)[number]
