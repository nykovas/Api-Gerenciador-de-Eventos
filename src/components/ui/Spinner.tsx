import { Loader as Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  className?: string
  size?: number
}

export function Spinner({ className, size = 20 }: SpinnerProps) {
  return <Loader2 className={cn('animate-spin text-brand-500', className)} style={{ width: size, height: size }} />
}

export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <Spinner size={32} />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  )
}
