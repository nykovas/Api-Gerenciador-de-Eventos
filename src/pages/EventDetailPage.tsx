import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  Copy,
  Trash2,
  RotateCcw,
  UserPlus,
  UserMinus,
  DoorOpen,
  DoorClosed,
} from 'lucide-react'
import { api, ApiError } from '@/api/client'
import type { EventItem } from '@/types'
import { Spinner } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { formatDate, fillRate, isToday } from '@/lib/utils'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [unsubOpen, setUnsubOpen] = useState(false)
  const [subAmount, setSubAmount] = useState(1)
  const [actionLoading, setActionLoading] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getEvent(Number(id))
      setEvent(data)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Evento não encontrado.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  async function handleDelete() {
    try {
      await api.deleteEvent(Number(id))
      toast('Evento excluído com sucesso.', 'success')
      navigate('/events')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao excluir.', 'error')
    }
  }

  async function handleDuplicate() {
    try {
      const duplicated = await api.duplicateEvent(Number(id))
      toast('Evento duplicado com sucesso.', 'success')
      navigate(`/events/${duplicated.id}`)
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao duplicar.', 'error')
    }
  }

  async function handleToggleStatus() {
    try {
      const updated = await api.alternateStatus(Number(id))
      setEvent(updated)
      toast('Status do evento alterado.', 'success')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao alterar status.', 'error')
    }
  }

  async function handleReset() {
    setActionLoading(true)
    try {
      const updated = await api.resetSubscriptions(Number(id))
      setEvent(updated)
      toast('Inscrições resetadas com sucesso.', 'success')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao resetar inscrições.', 'error')
    } finally {
      setActionLoading(false)
      setResetOpen(false)
    }
  }

  async function handleSubscribe(amount: number) {
    setActionLoading(true)
    try {
      await api.subscribe({ eventId: Number(id), participant: amount })
      await load()
      toast(`${amount} inscrição(ões) adicionada(s).`, 'success')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao inscrever.', 'error')
    } finally {
      setActionLoading(false)
      setSubOpen(false)
    }
  }

  async function handleUnsubscribe(amount: number) {
    setActionLoading(true)
    try {
      await api.unsubscribe({ eventId: Number(id), participant: amount })
      await load()
      toast(`${amount} inscrição(ões) removida(s).`, 'success')
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Erro ao cancelar inscrição.', 'error')
    } finally {
      setActionLoading(false)
      setUnsubOpen(false)
    }
  }

  if (loading) return <Spinner className="mx-auto mt-20" size={32} />
  if (error || !event)
    return (
      <div className="space-y-4">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Voltar para eventos
        </Link>
        <EmptyState icon={CalendarDays} title="Evento não encontrado" description={error || 'O evento solicitado não existe.'} action={<Link to="/events" className="btn-primary">Ver todos os eventos</Link>} />
      </div>
    )

  const isOpen = event.status === 'OPEN'

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Voltar para eventos
      </Link>

      <div className="card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{event.name}</h1>
              <StatusBadge status={event.status} />
              {isToday(event.date) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                  <CalendarDays className="h-3 w-3" /> Hoje
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">{event.description}</p>
          </div>
          <Link to={`/events/${event.id}/edit`} className="btn-secondary shrink-0">
            <Pencil className="h-4 w-4" /> Editar
          </Link>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-4">
            <CalendarDays className="h-5 w-5 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Data</p>
              <p className="text-sm font-medium text-slate-900">{formatDate(event.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-4">
            <MapPin className="h-5 w-5 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Localização</p>
              <p className="text-sm font-medium text-slate-900 truncate">{event.localization}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-4">
            <Users className="h-5 w-5 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Inscritos</p>
              <p className="text-sm font-medium text-slate-900">{event.subscribers} / {event.maxCapacity}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">Ocupação</p>
            <p className="text-sm text-slate-500">{fillRate(event.subscribers, event.maxCapacity)}%</p>
          </div>
          <ProgressBar value={event.subscribers} max={event.maxCapacity} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Ações</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <button onClick={() => setSubOpen(true)} disabled={!isOpen} className="btn-secondary justify-start">
            <UserPlus className="h-4 w-4" /> Inscrever
          </button>
          <button onClick={() => setUnsubOpen(true)} disabled={event.subscribers === 0} className="btn-secondary justify-start">
            <UserMinus className="h-4 w-4" /> Cancelar Inscrição
          </button>
          <button onClick={handleToggleStatus} className="btn-secondary justify-start">
            {isOpen ? <DoorClosed className="h-4 w-4" /> : <DoorOpen className="h-4 w-4" />}
            {isOpen ? 'Fechar' : 'Abrir'}
          </button>
          <button onClick={handleDuplicate} className="btn-secondary justify-start">
            <Copy className="h-4 w-4" /> Duplicar
          </button>
          <button onClick={() => setResetOpen(true)} disabled={event.subscribers === 0} className="btn-secondary justify-start">
            <RotateCcw className="h-4 w-4" /> Resetar Inscrições
          </button>
          <button onClick={() => setDeleteOpen(true)} className="btn-danger justify-start">
            <Trash2 className="h-4 w-4" /> Excluir
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Excluir evento"
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        icon={Trash2}
      />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Resetar inscrições"
        message="Isso irá zerar todos os inscritos deste evento. Deseja continuar?"
        confirmLabel="Resetar"
        icon={RotateCcw}
      />

      <Modal open={subOpen} onClose={() => setSubOpen(false)} title="Inscrever Participantes" description={`Vagas disponíveis: ${event.maxCapacity - event.subscribers}`}>
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="sub-amount">Quantidade de participantes</label>
            <input
              id="sub-amount"
              type="number"
              min={1}
              max={event.maxCapacity - event.subscribers}
              value={subAmount}
              onChange={(e) => setSubAmount(Math.max(1, Number(e.target.value)))}
              className="input"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setSubOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={() => handleSubscribe(subAmount)} disabled={actionLoading} className="btn-primary">
              {actionLoading ? 'Processando...' : 'Inscrever'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={unsubOpen} onClose={() => setUnsubOpen(false)} title="Cancelar Inscrições" description={`Inscritos atuais: ${event.subscribers}`}>
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="unsub-amount">Quantidade a cancelar</label>
            <input
              id="unsub-amount"
              type="number"
              min={1}
              max={event.subscribers}
              value={subAmount}
              onChange={(e) => setSubAmount(Math.max(1, Number(e.target.value)))}
              className="input"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setUnsubOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={() => handleUnsubscribe(subAmount)} disabled={actionLoading} className="btn-primary">
              {actionLoading ? 'Processando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
