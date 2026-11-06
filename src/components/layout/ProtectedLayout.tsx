import { Outlet, Navigate } from 'react-router-dom'
import { useSession } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/auth.store'
import Sidebar from './Sidebar'
import Header from './Header'
import { Brand } from './Brand'
import { Spinner } from '@/components/ui/spinner'

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <Brand />
      <Spinner className="size-5 text-primary" />
    </div>
  )
}

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useSession()

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const user = useAuthStore((s) => s.user)

  if (user && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
