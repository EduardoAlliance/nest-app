import api from './axios'
import type {
  ApiResponse,
  LoginResponse,
  RefreshResponse,
  SessionUser,
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../types'

export const authApi = {
  login(data: LoginDto) {
    return api.post<ApiResponse<LoginResponse>>('/auth/login', data)
  },

  register(data: RegisterDto) {
    return api.post<ApiResponse<SessionUser>>('/auth/register', data)
  },

  /**
   * El refresh token viaja en la cookie HttpOnly, por eso no se envía body.
   */
  refresh() {
    return api.post<ApiResponse<RefreshResponse>>('/auth/refresh')
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
