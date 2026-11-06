import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useForgotPassword } from '../../hooks/useAuth'
import { KeyRound } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

const forgotSchema = z.object({
  email: z.string().email('Email inválido'),
})

type ForgotForm = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = (data: ForgotForm) => {
    forgotPassword.mutate(data)
  }

  return (
    <AuthLayout
      title="Recupera tu contraseña"
      description="Ingresa tu email y te enviaremos un enlace para restablecerla."
      icon={<KeyRound className="size-5" />}
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Volver al inicio de sesión
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              className="h-10"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            <FieldError errors={[errors.email]} />
            <FieldDescription>
              Solo enviaremos un enlace si el correo está registrado.
            </FieldDescription>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          className="h-10 w-full"
          disabled={forgotPassword.isPending}
        >
          {forgotPassword.isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Enviando...
            </>
          ) : (
            'Enviar enlace'
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
