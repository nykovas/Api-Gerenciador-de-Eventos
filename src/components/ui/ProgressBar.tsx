import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  className?: string
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100)
  const isFull = value >= max && max > 0
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          isFull ? 'bg-amber-500' : 'bg-brand-500',
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
