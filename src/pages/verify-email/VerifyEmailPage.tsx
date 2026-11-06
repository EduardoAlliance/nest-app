import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, MailCheck, TriangleAlert } from 'lucide-react'
import { useVerifyEmail } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/auth.store'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { mutate, isSuccess, isError, error } = useVerifyEmail()
  const requested = useRef(false)

  useEffect(() => {
    if (!token || requested.current) return
    requested.current = true
    mutate({ token })
  }, [token, mutate])

  const errorMessage =
    (error as { response?: { data?: { message?: string } } } | null)?.response
      ?.data?.message ??
    'El enlace de verificación no es válido o ya expiró.'

  if (!token) {
    return (
      <AuthLayout
        title="Enlace inválido"
        description="El enlace de verificación no es válido o ya expiró."
        icon={<TriangleAlert className="size-5" />}
      >
        <div className="flex flex-col gap-4">
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>No pudimos verificar tu enlace</AlertTitle>
            <AlertDescription>
              Solicita un nuevo correo de verificación o inicia sesión con tu
              cuenta.
            </AlertDescription>
          </Alert>

          <Button asChild size="lg" className="h-10 w-full">
            <Link to="/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (isError) {
    return (
      <AuthLayout
        title="No pudimos verificar tu email"
        description="El enlace puede haber expirado o ya fue utilizado."
        icon={<TriangleAlert className="size-5" />}
      >
        <div className="flex flex-col gap-4">
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Verificación fallida</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>

          <Button asChild size="lg" className="h-10 w-full">
            <Link to="/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Email verificado"
        description="Tu cuenta está lista para usarse."
        icon={<MailCheck className="size-5" />}
      >
        <div className="flex flex-col gap-4">
          <Alert>
            <CheckCircle2 />
            <AlertTitle>Verificación completada</AlertTitle>
            <AlertDescription>
              Tu correo electrónico quedó verificado correctamente.
            </AlertDescription>
          </Alert>

          <Button asChild size="lg" className="h-10 w-full">
            <Link to={isAuthenticated ? '/dashboard' : '/login'}>
              {isAuthenticated ? 'Ir al dashboard' : 'Iniciar sesión'}
            </Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Verificando tu email"
      description="Estamos validando el enlace. Esto tomará solo un momento."
      icon={<MailCheck className="size-5" />}
    >
      <div className="flex items-center justify-center gap-3 rounded-lg border border-border/70 bg-muted/30 px-4 py-8">
        <Spinner className="size-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          Verificando enlace...
        </span>
      </div>
    </AuthLayout>
  )
}
