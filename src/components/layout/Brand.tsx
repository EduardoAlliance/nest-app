import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrandProps {
  compact?: boolean
  className?: string
}

export function Brand({ compact = false, className }: BrandProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <ShieldCheck className="size-5" />
      </div>
      {!compact && (
        <div className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold tracking-tight">
            AdminPanel
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">
            Control de acceso
          </span>
        </div>
      )}
    </div>
  )
}
