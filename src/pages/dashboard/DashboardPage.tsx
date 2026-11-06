import { useProfile } from '../../hooks/useUsers'
import { Activity, CalendarDays, ShieldCheck, UserRound, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { roleLabel, roleVariant } from '@/lib/badges'
import { Link } from 'react-router-dom'

interface Stat {
  label: string
  value: string
  icon: LucideIcon
  accent: string
}

export default function DashboardPage() {
  const { data: user } = useProfile()

  const stats: Stat[] = [
    {
      label: 'Usuarios totales',
      value: '—',
      icon: Users,
      accent: 'bg-primary/10 text-primary',
    },
    {
      label: 'Sesiones activas',
      value: '—',
      icon: Activity,
      accent: 'bg-success/10 text-success',
    },
    {
      label: 'Rol de acceso',
      value: roleLabel(user?.role),
      icon: ShieldCheck,
      accent: 'bg-warning/10 text-warning',
    },
    {
      label: 'Miembro desde',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '—',
      icon: CalendarDays,
      accent: 'bg-secondary text-secondary-foreground',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general de tu cuenta y actividad.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="transition-shadow hover:shadow-md hover:ring-primary/20"
          >
            <CardContent className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </span>
                <span className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-xl',
                  stat.accent,
                )}
              >
                <stat.icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-4 text-primary" />
              Información del usuario
            </CardTitle>
            <CardDescription>
              Datos asociados a tu cuenta dentro del panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-40 text-muted-foreground">
                    Nombre
                  </TableCell>
                  <TableCell className="font-medium">
                    {user?.name || '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Email</TableCell>
                  <TableCell>{user?.email || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Rol</TableCell>
                  <TableCell>
                    <Badge variant={roleVariant(user?.role)}>
                      {user?.role || '—'}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Email verificado
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user?.emailVerified ? 'success' : 'outline'}
                    >
                      {user?.emailVerified ? 'Verificado' : 'Pendiente'}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Estado de la cuenta
            </CardTitle>
            <CardDescription>Revisa el estado y la seguridad de tu acceso.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Estado</span>
              <Badge variant="success">Activo</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Verificación
              </span>
              <Badge variant={user?.emailVerified ? 'success' : 'warning'}>
                {user?.emailVerified ? 'Verificado' : 'Pendiente'}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Acceso</span>
              <span className="text-sm font-medium capitalize">
                {user?.role || '—'}
              </span>
            </div>

            <Separator />

            <Button asChild variant="outline" className="w-full">
              <Link to="/profile">Editar perfil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
