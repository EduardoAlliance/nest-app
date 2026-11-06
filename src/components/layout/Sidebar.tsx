import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  User,
  Users,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { useLogout } from '../../hooks/useAuth'
import { Brand } from './Brand'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/format'

interface SidebarNavProps {
  collapsed?: boolean
  onNavigate?: () => void
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const user = useAuthStore((s) => s.user)

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Mi perfil', icon: User },
    ...(user?.role === 'admin'
      ? [{ to: '/admin/users', label: 'Usuarios', icon: Users }]
      : []),
  ]

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      {!collapsed && (
        <span className="mb-2 px-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Navegación
        </span>
      )}
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          title={collapsed ? link.label : undefined}
          className={({ isActive }) =>
            cn(
              'group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
              collapsed && 'justify-center px-0',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )
          }
        >
          <link.icon className="size-[18px] shrink-0" />
          {!collapsed && <span className="truncate">{link.label}</span>}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 md:flex',
        collapsed ? 'w-[76px]' : 'w-64',
      )}
    >
      <Button
        variant="outline"
        size="icon-xs"
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        onClick={() => setCollapsed((value) => !value)}
        className="absolute top-6 -right-3 z-10 rounded-full bg-background shadow-sm"
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>

      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-sidebar-border',
          collapsed ? 'justify-center px-2' : 'px-5',
        )}
      >
        <Brand compact={collapsed} />
      </div>

      <SidebarNav collapsed={collapsed} />

      <div className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-sidebar-accent/60 p-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          title="Cerrar sesión"
          className={cn(
            'w-full text-muted-foreground hover:text-foreground',
            collapsed ? 'justify-center px-0' : 'justify-start',
          )}
        >
          {logout.isPending ? <Spinner /> : <LogOut className="size-4" />}
          {!collapsed && (
            <span>{logout.isPending ? 'Cerrando...' : 'Cerrar sesión'}</span>
          )}
        </Button>
      </div>
    </aside>
  )
}
