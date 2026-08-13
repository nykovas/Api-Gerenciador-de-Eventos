import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { api, ApiError } from '@/api/client'
import type { EventDto, EventItem } from '@/types'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { todayISO } from '@/lib/utils'

interface FieldErrors {
  name?: string
  description?: string
  localization?: string
  date?: string
  maxCapacity?: string
  subscribers?: string
}

export default function EventFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<EventDto>({
    name: '',
    description: '',
    localization: '',
    date: todayISO(),
    maxCapacity: 1,
    subscribers: 0,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    async function load() {
      try {
        const event: EventItem = await api.getEvent(Number(id))
        setForm({
          name: event.name,
          description: event.description,
          localization: event.localization,
          date: event.date,
          maxCapacity: event.maxCapacity,
          subscribers: event.subscribers,
        })
      } catch (e) {
        toast(e instanceof ApiError ? e.message : 'Evento não encontrado.', 'error')
        navigate('/events')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!form.name.trim()) next.name = 'O nome é obrigatório.'
    if (!form.description.trim()) next.description = 'A descrição é obrigatória.'
    if (!form.localization.trim()) next.localization = 'A localização é obrigatória.'
    if (!form.date) next.date = 'A data é obrigatória.'
    if (!isEdit && form.date < todayISO()) next.date = 'A data não pode ser anterior a hoje.'
    if (!form.maxCapacity || form.maxCapacity < 1) next.maxCapacity = 'A capacidade mínima é 1.'
    if (isEdit && form.maxCapacity < form.subscribers) next.maxCapacity = 'Capacidade não pode ser menor que os inscritos atuais.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (isEdit) {
        await api.patchEvent(Number(id), form)
        toast('Evento atualizado com sucesso.', 'success')
        navigate(`/events/${id}`)
      } else {
        const created = await api.createEvent(form)
        toast('Evento criado com sucesso.', 'success')
        navigate(`/events/${created.id}`)
      }
    } catch (e) {
      if (e instanceof ApiError && e.invalidFields) {
        setErrors(e.invalidFields as FieldErrors)
      } else {
        toast(e instanceof ApiError ? e.message : 'Erro ao salvar evento.', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner className="mx-auto mt-20" size={32} />

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <Link to={isEdit ? `/events/${id}` : '/events'} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Editar Evento' : 'Criar Evento'}</h1>
        <p className="mt-1 text-sm text-slate-500">{isEdit ? 'Atualize as informações do evento.' : 'Preencha os dados do novo evento.'}</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5" noValidate>
        <div>
          <label className="label" htmlFor="name">Nome *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder="Ex: Conferência de Tecnologia 2026"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="label" htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input min-h-[100px] resize-y"
            placeholder="Descreva o evento..."
            aria-invalid={!!errors.description}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="label" htmlFor="localization">Localização *</label>
          <input
            id="localization"
            type="text"
            value={form.localization}
            onChange={(e) => setForm({ ...form, localization: e.target.value })}
            className="input"
            placeholder="Ex: Centro de Convenções - São Paulo"
            aria-invalid={!!errors.localization}
          />
          {errors.localization && <p className="mt-1 text-xs text-red-600">{errors.localization}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="date">Data *</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input"
              aria-invalid={!!errors.date}
            />
            {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
          </div>

          <div>
            <label className="label" htmlFor="maxCapacity">Capacidade Máxima *</label>
            <input
              id="maxCapacity"
              type="number"
              min={1}
              value={form.maxCapacity}
              onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })}
              className="input"
              aria-invalid={!!errors.maxCapacity}
            />
            {errors.maxCapacity && <p className="mt-1 text-xs text-red-600">{errors.maxCapacity}</p>}
          </div>
        </div>

        {isEdit && (
          <div>
            <label className="label" htmlFor="subscribers">Inscritos Atuais</label>
            <input
              id="subscribers"
              type="number"
              min={0}
              value={form.subscribers}
              disabled
              className="input bg-slate-50 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-slate-400">Gerenciado via inscrições na página do evento.</p>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Link to={isEdit ? `/events/${id}` : '/events'} className="btn-secondary">Cancelar</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Evento'}
          </button>
        </div>
      </form>
    </div>
  )
}
