import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Users,
  TrendingUp,
  DoorOpen,
  DoorClosed,
  ArrowRight,
  CalendarClock,
} from 'lucide-react'
import { api, ApiError } from '@/api/client'
import type { EventStatistics, EventItem } from '@/types'
import { Spinner } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'

interface StatCardProps {
  icon: typeof CalendarDays
  label: string
  value: string | number
  accent: string
}

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<EventStatistics | null>(null)
  const [todayEvents, setTodayEvents] = useState<EventItem[]>([])
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [statistics, today, all] = await Promise.all([
          api.statistics(),
          api.eventsToday(),
          api.listEvents(),
        ])
        setStats(statistics)
        setTodayEvents(today)
        setRecentEvents(all.slice(-5).reverse())
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Falha ao carregar dados.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Spinner className="mx-auto mt-20" size={32} />
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-secondary mt-4">
          Tentar novamente
        </button>
      </div>
    )

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Visão geral dos seus eventos e inscrições.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Total de Eventos" value={stats?.totalEvents ?? 0} accent="bg-brand-50 text-brand-600" />
        <StatCard icon={DoorOpen} label="Eventos Abertos" value={stats?.openEvents ?? 0} accent="bg-emerald-50 text-emerald-600" />
        <StatCard icon={DoorClosed} label="Eventos Fechados" value={stats?.closedEvents ?? 0} accent="bg-slate-100 text-slate-600" />
        <StatCard icon={Users} label="Total de Inscritos" value={stats?.totalSubscribers ?? 0} accent="bg-amber-50 text-amber-600" />
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Média de Inscritos por Evento</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.averageSubscribers ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-semibold text-slate-900">Eventos de Hoje</h2>
            </div>
            <Link to="/events/today" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {todayEvents.length === 0 ? (
            <EmptyState icon={CalendarClock} title="Nenhum evento hoje" description="Não há eventos programados para esta data." />
          ) : (
            <ul className="space-y-3">
              {todayEvents.map((e) => (
                <li key={e.id}>
                  <Link to={`/events/${e.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 transition-colors hover:border-brand-200 hover:bg-brand-50/50">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{e.name}</p>
                      <p className="text-xs text-slate-500 truncate">{e.localization}</p>
                    </div>
                    <StatusBadge status={e.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-semibold text-slate-900">Eventos Recentes</h2>
            </div>
            <Link to="/events" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentEvents.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Nenhum evento criado" description="Crie seu primeiro evento para começar." action={<Link to="/events/new" className="btn-primary">Criar evento</Link>} />
          ) : (
            <ul className="space-y-3">
              {recentEvents.map((e) => (
                <li key={e.id}>
                  <Link to={`/events/${e.id}`} className="block rounded-lg border border-slate-100 p-3 transition-colors hover:border-brand-200 hover:bg-brand-50/50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 truncate">{e.name}</p>
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span>{formatDate(e.date)}</span>
                      <span>·</span>
                      <span>{e.subscribers}/{e.maxCapacity} inscritos</span>
                    </div>
                    <ProgressBar value={e.subscribers} max={e.maxCapacity} className="mt-2" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
