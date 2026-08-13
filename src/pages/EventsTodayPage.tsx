import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, ArrowRight } from 'lucide-react'
import { api, ApiError } from '@/api/client'
import type { EventItem } from '@/types'
import { Spinner } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'


export default function EventsTodayPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.eventsToday()
        setEvents(data)
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Falha ao carregar eventos.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Eventos de Hoje</h1>
        <p className="mt-1 text-sm text-slate-500 capitalize">{todayLabel}</p>
      </div>

      {loading ? (
        <Spinner className="mx-auto mt-20" size={32} />
      ) : error ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-secondary mt-4">Tentar novamente</button>
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Nenhum evento hoje"
          description="Não há eventos programados para esta data."
          action={<Link to="/events/new" className="btn-primary">Criar evento</Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">{event.name}</h3>
                <StatusBadge status={event.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{event.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>{event.localization}</span>
                <span>{event.subscribers}/{event.maxCapacity} inscritos</span>
              </div>
              <ProgressBar value={event.subscribers} max={event.maxCapacity} className="mt-2" />
              <div className="mt-3 flex items-center justify-end text-sm text-brand-600">
                Ver detalhes <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
