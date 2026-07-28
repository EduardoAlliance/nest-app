import { useAuthStore } from '../../store/auth.store'
import { Users, ShieldCheck, Activity, Calendar } from 'lucide-react'

const stats = [
  { label: 'Total Usuarios', value: '—', icon: Users, color: 'text-primary' },
  { label: 'Sesiones Activas', value: '—', icon: Activity, color: 'text-success' },
  { label: 'Rol', value: '', icon: ShieldCheck, color: 'text-warning' },
  { label: 'Miembro desde', value: '', icon: Calendar, color: 'text-info' },
]

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const enrichedStats = stats.map((stat) => {
    if (stat.label === 'Rol') return { ...stat, value: user?.role || '—' }
    if (stat.label === 'Miembro desde')
      return {
        ...stat,
        value: user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '—',
      }
    return stat
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {enrichedStats.map((stat) => (
          <div key={stat.label} className="card bg-base-200 shadow-md">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={stat.color} size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Información del Usuario</h2>
          <div className="overflow-x-auto mt-4">
            <table className="table">
              <tbody>
                <tr>
                  <td className="font-medium text-base-content/60">Nombre</td>
                  <td>{user?.name}</td>
                </tr>
                <tr>
                  <td className="font-medium text-base-content/60">Email</td>
                  <td>{user?.email}</td>
                </tr>
                <tr>
                  <td className="font-medium text-base-content/60">Rol</td>
                  <td>
                    <span
                      className={`badge ${
                        user?.role === 'admin'
                          ? 'badge-error'
                          : user?.role === 'moderator'
                            ? 'badge-warning'
                            : 'badge-success'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-base-content/60">Email verificado</td>
                  <td>
                    {user?.isEmailVerified ? (
                      <span className="badge badge-success">Sí</span>
                    ) : (
                      <span className="badge badge-ghost">No</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
