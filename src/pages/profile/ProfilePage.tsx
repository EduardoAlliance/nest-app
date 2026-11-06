import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CalendarDays,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { useProfile, useUpdateProfile } from '../../hooks/useUsers'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { getInitials } from '@/lib/format'
import { roleLabel, roleVariant } from '@/lib/badges'

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z
    .string()
    .trim()
    .max(30, 'El teléfono no puede superar los 30 caracteres')
    .regex(/^[+()\d\s-]*$/, 'Ingresa un teléfono válido'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresa tu contraseña actual'),
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

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: user ? { name: user.name, phone: user.phone ?? '' } : undefined,
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-6 text-primary" />
      </div>
    )
  }

  const onSubmitProfile = (data: ProfileForm) => {
    updateProfile.mutate({
      name: data.name,
      phone: data.phone.trim() || undefined,
    })
  }

  const onSubmitPassword = (data: PasswordForm) => {
    updateProfile.mutate(
      { currentPassword: data.currentPassword, password: data.password },
      { onSuccess: () => resetPasswordForm() },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Mi perfil</h1>
        <p className="text-sm text-muted-foreground">
          Administra tu información personal y la seguridad de tu cuenta.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-semibold tracking-tight">
                {user?.name}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <Badge variant={roleVariant(user?.role)}>
              {roleLabel(user?.role)}
            </Badge>

            <Separator className="my-2" />

            <div className="flex w-full flex-col gap-3 text-left">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{user?.phone || 'Sin teléfono'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                <span>
                  {user?.emailVerified
                    ? 'Email verificado'
                    : 'Email sin verificar'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                <span>
                  Miembro desde{' '}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                      })
                    : '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos personales</CardTitle>
              <CardDescription>
                Actualiza tu nombre y teléfono. El correo no se puede cambiar
                desde aquí.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmitProfile)}
                className="flex flex-col gap-5"
              >
                <FieldGroup>
                  <Field data-invalid={!!errors.name}>
                    <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      className="h-10"
                      aria-invalid={!!errors.name}
                      {...register('name')}
                    />
                    <FieldError errors={[errors.name]} />
                  </Field>

                  <Field data-invalid={!!errors.phone}>
                    <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+52 55 0000 0000"
                      className="h-10"
                      aria-invalid={!!errors.phone}
                      {...register('phone')}
                    />
                    <FieldError errors={[errors.phone]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email ?? ''}
                      className="h-10"
                      disabled
                      readOnly
                    />
                    <FieldDescription>
                      El correo electrónico no se puede modificar.
                    </FieldDescription>
                  </Field>
                </FieldGroup>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="h-10"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Spinner data-icon="inline-start" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Para cambiar tu contraseña necesitamos confirmar la actual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handlePasswordSubmit(onSubmitPassword)}
                className="flex flex-col gap-5"
              >
                <FieldGroup>
                  <Field data-invalid={!!passwordErrors.currentPassword}>
                    <FieldLabel htmlFor="currentPassword">
                      Contraseña actual
                    </FieldLabel>
                    <Input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      className="h-10"
                      aria-invalid={!!passwordErrors.currentPassword}
                      {...registerPassword('currentPassword')}
                    />
                    <FieldError errors={[passwordErrors.currentPassword]} />
                  </Field>

                  <Field data-invalid={!!passwordErrors.password}>
                    <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Mín. 8 caracteres"
                      className="h-10"
                      aria-invalid={!!passwordErrors.password}
                      {...registerPassword('password')}
                    />
                    <FieldError errors={[passwordErrors.password]} />
                  </Field>

                  <Field data-invalid={!!passwordErrors.confirmPassword}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirmar nueva contraseña
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repite la contraseña"
                      className="h-10"
                      aria-invalid={!!passwordErrors.confirmPassword}
                      {...registerPassword('confirmPassword')}
                    />
                    <FieldError errors={[passwordErrors.confirmPassword]} />
                  </Field>
                </FieldGroup>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="h-10"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Spinner data-icon="inline-start" />
                        Actualizando...
                      </>
                    ) : (
                      'Cambiar contraseña'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
