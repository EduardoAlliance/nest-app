import api from './axios'
import type {
  ApiResponse,
  User,
  AuthTokens,
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../types'

export const authApi = {
  login(data: LoginDto) {
    return api.post<ApiResponse<AuthTokens>>('/auth/login', data)
  },

  register(data: RegisterDto) {
    return api.post<ApiResponse<{ user: User }>>('/auth/register', data)
  },

  refresh() {
    return api.post<ApiResponse<AuthTokens>>('/auth/refresh')
  },

  logout() {
    return api.post<ApiResponse<null>>('/auth/logout')
  },

  forgotPassword(data: ForgotPasswordDto) {
    return api.post<ApiResponse<null>>('/auth/forgot-password', data)
  },

  resetPassword(data: ResetPasswordDto) {
    return api.post<ApiResponse<null>>('/auth/reset-password', data)
  },

  verifyEmail(data: { token: string }) {
    return api.post<ApiResponse<null>>('/auth/verify-email', data)
  },
}
