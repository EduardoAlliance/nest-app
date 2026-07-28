import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useSearchParams } from 'react-router-dom'
import { useResetPassword } from '../../hooks/useAuth'
import { Lock } from 'lucide-react'

const resetSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type ResetForm = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const resetPassword = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = (data: ResetForm) => {
    if (!token) return
    resetPassword.mutate({ token, password: data.password })
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-300 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body p-8 text-center">
            <h1 className="text-2xl font-bold text-error">Token inválido</h1>
            <p className="text-base-content/60 mt-2">
              El enlace de restablecimiento no es válido o ha expirado.
            </p>
            <Link to="/forgot-password" className="btn btn-primary mt-4">
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Lock className="text-primary" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Nueva Contraseña</h1>
            <p className="text-base-content/60 text-sm mt-1">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nueva Contraseña</span>
              </label>
              <input
                type="password"
                placeholder="Mín. 8 caracteres"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                {...register('password')}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Confirmar Contraseña</span>
              </label>
              <input
                type="password"
                placeholder="Repite la contraseña"
                className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Restablecer Contraseña'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-base-content/60">
              <Link to="/login" className="link link-primary">
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
