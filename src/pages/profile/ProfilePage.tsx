import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfile, useUpdateProfile } from '../../hooks/useUsers'
import { User } from 'lucide-react'

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: user ? { name: user.name, email: user.email } : undefined,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  const onSubmit = (data: ProfileForm) => {
    updateProfile.mutate(data)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-24 h-24">
                  <User size={48} />
                </div>
              </div>
              <h2 className="text-xl font-bold mt-2">{user?.name}</h2>
              <p className="text-base-content/60">{user?.email}</p>
              <div className="mt-2">
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
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Editar Perfil</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Nombre</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                    {...register('name')}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.name.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email.message}</span>
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
