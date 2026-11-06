import type { Role } from '../types'

export function roleVariant(role?: Role) {
  if (role === 'admin') return 'destructive' as const
  if (role === 'moderator') return 'warning' as const
  return 'success' as const
}

export function roleLabel(role?: Role) {
  if (!role) return '—'
  return role.charAt(0).toUpperCase() + role.slice(1)
}
