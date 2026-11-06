import type { ReactNode } from 'react'
import { LockKeyhole, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Brand } from './Brand'

interface AuthLayoutProps {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
  footer?: ReactNode
}

const features = [
  {
    icon: LockKeyhole,
    title: 'Acceso seguro',
    description: 'Sesiones protegidas con tokens de renovación automática.',
  },
  {
    icon: Users,
    title: 'Gestión de equipos',
    description: 'Administra usuarios, roles y permisos desde un solo lugar.',
  },
  {
    icon: Sparkles,
    title: 'Experiencia clara',
    description: 'Una interfaz enfocada en lo que realmente importa.',
  },
]

export function AuthLayout({
  title,
  description,
  icon,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-2xl shadow-black/10 ring-1 ring-foreground/5 backdrop-blur-xl lg:grid-cols-[1.05fr_1fr]">
        <div className="relative hidden flex-col justify-between gap-10 overflow-hidden border-r border-border/60 bg-gradient-to-br from-primary/15 via-card to-card p-10 lg:flex">
          <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-primary/20 blur-3xl" />

          <Brand className="relative" />

          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="max-w-xs text-3xl leading-tight font-semibold tracking-tight text-balance">
                Todo tu equipo bajo control, en un solo panel.
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Una forma simple y segura de administrar cuentas, roles y accesos
                dentro de tu organización.
              </p>
            </div>

            <ul className="flex flex-col gap-4">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/70 text-primary ring-1 ring-border">
                    <feature.icon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{feature.title}</span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-xs text-muted-foreground">
            © {new Date().getFullYear()} AdminPanel. Todos los derechos reservados.
          </p>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <Brand className="mb-8 lg:hidden" />

          <div className="mb-8 flex flex-col gap-1.5">
            <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              {icon}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {children}

          {footer && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
