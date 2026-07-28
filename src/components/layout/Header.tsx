import { useAuthStore } from '../../store/auth.store'
import { User, Bell } from 'lucide-react'

export default function Header() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="bg-base-200 border-b border-base-300 px-6 py-3 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Bienvenido, {user?.name || 'Usuario'}</h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn btn-ghost btn-sm btn-circle">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-8 h-8">
              <User size={16} />
            </div>
          </div>
          <span className="text-sm font-medium hidden sm:block">{user?.email}</span>
        </div>
      </div>
    </header>
  )
}
