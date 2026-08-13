import { cn } from '@/lib/utils'
import type { EventStatus } from '@/types'

interface BadgeProps {
  status: EventStatus
}

export function StatusBadge({ status }: BadgeProps) {
  const isOpen = status === 'OPEN'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', isOpen ? 'bg-emerald-500' : 'bg-slate-400')} />
      {isOpen ? 'Aberto' : 'Fechado'}
    </span>
  )
}
