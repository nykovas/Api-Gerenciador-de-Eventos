import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  CalendarDays,
  Plus,
  Users,
  MapPin,
  Copy,
  Trash2,
  Power,
  Eye,
} from 'lucide-react'
import { api, ApiError } from '@/api/client'
import type { EventItem } from '@/types'
import { Spinner } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { formatDate, fillRate, cn } from '@/lib/utils'

type SortKey = 'date' | 'name' | 'subscribers'
type FilterKey = 'all' | 'open' | 'closed'

export default function EventsListPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listEvents()
      setEvents(data)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Falha ao carregar eventos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let result = [...events]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.localization.toLowerCase().includes(q),
      )
    }
    if (filter === 'open') result = result.filter((e) => e.status === 'OPEN')
    if (filter === 'closed') result = result.filter((e) => e.status === 'CLOSED')
    result.sort((a, b) => {
      if (sortKey === 'date') return a.date.localeCompare(b.date)
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      return b.subscribers - a.subscribers
    })
    return result
  }, [events, search, sortKey, filter])

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await api.deleteEvent(deleteId)
      setEvents((prev) => prev.filter((e) => e.id !== deleteId))
      toast('Evento excluído com sucesso.', 'success')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao excluir evento.', 'error')
    }
  }

  async function handleDuplicate(id: number) {
    try {
      const duplicated = await api.duplicateEvent(id)
      setEvents((prev) => [...prev, duplicated])
      toast('Evento duplicado com sucesso.', 'success')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao duplicar evento.', 'error')
    }
  }

  async function handleToggleStatus(id: number) {
    try {
      const updated = await api.alternateStatus(id)
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)))
      toast('Status do evento alterado.', 'success')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao alterar status.', 'error')
    }
  }

  const filterTabs: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'open', label: 'Abertos' },
    { key: 'closed', label: 'Fechados' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eventos</h1>
          <p className="mt-1 text-sm text-slate-500">{events.length} evento(s) cadastrado(s).</p>
        </div>
        <Link to="/events/new" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          Criar Evento
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, descrição ou local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            aria-label="Buscar eventos"
          />
        </div>
        <div className="flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                filter === tab.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="input sm:w-auto"
          aria-label="Ordenar por"
        >
          <option value="date">Ordenar por Data</option>
          <option value="name">Ordenar por Nome</option>
          <option value="subscribers">Ordenar por Inscritos</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : error ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={load} className="btn-secondary mt-4">Tentar novamente</button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={search || filter !== 'all' ? 'Nenhum evento encontrado' : 'Nenhum evento criado'}
          description={search || filter !== 'all' ? 'Ajuste os filtros e tente novamente.' : 'Crie seu primeiro evento para começar.'}
          action={!search && filter === 'all' ? <Link to="/events/new" className="btn-primary">Criar evento</Link> : undefined}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <div key={event.id} className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link to={`/events/${event.id}`}>
                    <h3 className="text-base font-semibold text-slate-900 hover:text-brand-600 transition-colors truncate">{event.name}</h3>
                  </Link>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">{event.description}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>

              <div className="space-y-1.5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{event.localization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>{event.subscribers} / {event.maxCapacity} inscritos</span>
                </div>
              </div>

              <div>
                <ProgressBar value={event.subscribers} max={event.maxCapacity} />
                <p className="mt-1 text-xs text-slate-400 text-right">{fillRate(event.subscribers, event.maxCapacity)}% ocupado</p>
              </div>

              <div className="flex items-center gap-1 border-t border-slate-100 pt-3">
                <Link to={`/events/${event.id}`} className="btn-ghost flex-1 text-xs" title="Ver detalhes">
                  <Eye className="h-4 w-4" /> Ver
                </Link>
                <button onClick={() => handleDuplicate(event.id)} className="btn-ghost text-xs" title="Duplicar">
                  <Copy className="h-4 w-4" />
                </button>
                <button onClick={() => handleToggleStatus(event.id)} className="btn-ghost text-xs" title="Alternar status">
                  <Power className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteId(event.id)} className="btn-ghost text-xs text-red-600 hover:bg-red-50" title="Excluir">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir evento"
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        icon={Trash2}
      />
    </div>
  )
}
