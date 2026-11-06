import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useSearchParams } from 'react-router-dom'
import { useResetPassword } from '../../hooks/useAuth'
import { Lock, TriangleAlert } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
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
      <AuthLayout
        title="Enlace inválido"
        description="El enlace de restablecimiento no es válido o ya expiró."
        icon={<TriangleAlert className="size-5" />}
      >
        <div className="flex flex-col gap-4">
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>No pudimos verificar tu enlace</AlertTitle>
            <AlertDescription>
              Solicita un nuevo enlace de recuperación para continuar.
            </AlertDescription>
          </Alert>

          <Button asChild size="lg" className="h-10 w-full">
            <Link to="/forgot-password">Solicitar nuevo enlace</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Crea una nueva contraseña"
      description="Elige una contraseña segura que no hayas usado antes."
      icon={<Lock className="size-5" />}
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Volver al inicio de sesión
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mín. 8 caracteres"
              className="h-10"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">
              Confirmar contraseña
            </FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              className="h-10"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          className="h-10 w-full"
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Restableciendo...
            </>
          ) : (
            'Restablecer contraseña'
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
