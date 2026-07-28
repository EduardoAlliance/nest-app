import { useState } from 'react'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useRestoreUser } from '../../../hooks/useUsers'
import { Search, Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { User, CreateUserDto, UpdateUserDto } from '../../../types'

const userFormSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').or(z.literal('')),
  role: z.enum(['admin', 'moderator', 'user']),
})

type UserForm = z.infer<typeof userFormSchema>

const emptyForm: UserForm = { name: '', email: '', password: '', role: 'user' }

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const limit = 10

  const { data: paginated, isLoading } = useUsers({ page, limit, search: search || undefined, role: roleFilter || undefined })
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const restoreUser = useRestoreUser()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: emptyForm,
  })

  function openCreate() {
    setEditingUser(null)
    reset(emptyForm)
    setModalOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    reset({ name: user.name, email: user.email, password: '', role: user.role })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingUser(null)
    reset(emptyForm)
  }

  function onSubmit(data: UserForm) {
    if (editingUser) {
      const payload: UpdateUserDto = { name: data.name, email: data.email, role: data.role }
      if (data.password) payload.password = data.password
      updateUser.mutate({ id: editingUser.id, data: payload }, { onSuccess: closeModal })
    } else {
      const payload: CreateUserDto = { name: data.name, email: data.email, password: data.password, role: data.role }
      createUser.mutate(payload, { onSuccess: closeModal })
    }
  }

  const roleBadge = (role: string) => {
    const map: Record<string, string> = { admin: 'badge-error', moderator: 'badge-warning', user: 'badge-success' }
    return `badge ${map[role] || 'badge-ghost'}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Nuevo Usuario
        </button>
      </div>

      <div className="card bg-base-200 shadow-md mb-6">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="join flex-1">
              <div className="join-item flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  className="input input-bordered w-full pl-10"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                />
              </div>
              <button className="join-item btn btn-ghost" onClick={() => { setSearch(''); setPage(1) }}>
                <X size={18} />
              </button>
            </div>
            <select
              className="select select-bordered w-full sm:w-40"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
            >
              <option value="">Todos los roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <>
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Verificado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated?.items.map((user: User) => (
                    <tr key={user.id} className={user.deletedAt ? 'opacity-50' : ''}>
                      <td className="font-medium">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={roleBadge(user.role)}>{user.role}</span>
                      </td>
                      <td>
                        {user.deletedAt ? (
                          <span className="badge badge-ghost">Inactivo</span>
                        ) : (
                          <span className="badge badge-success">Activo</span>
                        )}
                      </td>
                      <td>
                        {user.isEmailVerified ? (
                          <span className="badge badge-success">Sí</span>
                        ) : (
                          <span className="badge badge-ghost">No</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-1">
                          {user.deletedAt ? (
                            <button
                              className="btn btn-ghost btn-sm btn-square text-info"
                              title="Restaurar"
                              onClick={() => restoreUser.mutate(user.id)}
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-ghost btn-sm btn-square text-primary"
                                title="Editar"
                                onClick={() => openEdit(user)}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="btn btn-ghost btn-sm btn-square text-error"
                                title="Eliminar"
                                onClick={() => {
                                  if (confirm('¿Estás seguro de eliminar este usuario?')) {
                                    deleteUser.mutate(user.id)
                                  }
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!paginated?.items || paginated.items.length === 0) && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-base-content/60">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {paginated && paginated.meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-4">
                  <button
                    className="btn btn-sm"
                    disabled={!paginated.meta.hasPreviousPage}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-base-content/60">
                    Página {paginated.meta.page} de {paginated.meta.totalPages}
                  </span>
                  <button
                    className="btn btn-sm"
                    disabled={!paginated.meta.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modalOpen && (
        <dialog className="modal modal-open" onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>
                <X size={18} />
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4">
              {editingUser ? 'Editar Usuario' : 'Crear Usuario'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Nombre</span></label>
                <input type="text" className={`input input-bordered ${errors.name ? 'input-error' : ''}`} {...register('name')} />
                {errors.name && <label className="label"><span className="label-text-alt text-error">{errors.name.message}</span></label>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input type="email" className={`input input-bordered ${errors.email ? 'input-error' : ''}`} {...register('email')} />
                {errors.email && <label className="label"><span className="label-text-alt text-error">{errors.email.message}</span></label>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">{editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}</span></label>
                <input type="password" className={`input input-bordered ${errors.password ? 'input-error' : ''}`} {...register('password')} />
                {errors.password && <label className="label"><span className="label-text-alt text-error">{errors.password.message}</span></label>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Rol</span></label>
                <select className="select select-bordered" {...register('role')}>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={createUser.isPending || updateUser.isPending}>
                  {(createUser.isPending || updateUser.isPending) ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    editingUser ? 'Guardar' : 'Crear'
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </dialog>
      )}
    </div>
  )
}
