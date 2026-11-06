import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedLayout, { AdminLayout } from '../components/layout/ProtectedLayout'
import { Spinner } from '@/components/ui/spinner'

const LoginPage = lazy(() => import('../pages/login/LoginPage'))
const RegisterPage = lazy(() => import('../pages/register/RegisterPage'))
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))
const AdminUsersPage = lazy(() => import('../pages/admin/users/AdminUsersPage'))
const ForgotPasswordPage = lazy(() => import('../pages/forgot-password/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('../pages/reset-password/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('../pages/verify-email/VerifyEmailPage'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Spinner className="size-6 text-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },
  {
    path: '/register',
    element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
  },
  {
    path: '/forgot-password',
    element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
  },
  {
    path: '/reset-password',
    element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>,
  },
  {
    path: '/verify-email',
    element: <SuspenseWrapper><VerifyEmailPage /></SuspenseWrapper>,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
      },
      {
        path: 'profile',
        element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            path: 'users',
            element: <SuspenseWrapper><AdminUsersPage /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
