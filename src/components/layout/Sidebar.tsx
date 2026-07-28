import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import {
  LayoutDashboard,
  User,
  Users,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useLogout } from '../../hooks/useAuth'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Perfil', icon: User },
    ...(user?.role === 'admin'
      ? [{ to: '/admin/users', label: 'Usuarios', icon: Users }]
      : []),
  ]

  return (
    <aside
      className={`bg-base-200 min-h-screen flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="text-primary" size={24} />
            <span className="font-bold text-lg">AdminPanel</span>
          </div>
        )}
        <button
          className="btn btn-ghost btn-sm btn-square"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-content'
                  : 'hover:bg-base-300 text-base-content/70 hover:text-base-content'
              }`
            }
            title={collapsed ? link.label : undefined}
          >
            <link.icon size={20} />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-base-300">
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full hover:bg-base-300 text-base-content/70 hover:text-base-content transition-colors"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut size={20} />
          {!collapsed && <span>{logout.isPending ? 'Cerrando...' : 'Cerrar sesión'}</span>}
        </button>
      </div>
    </aside>
  )
}
