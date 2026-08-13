import type {
  EventItem,
  EventDto,
  SubscribeDto,
  EventCount,
  EventStatistics,
  ErrorResponse,
} from '@/types'

const BASE = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    let errorBody: ErrorResponse = {}
    try {
      errorBody = await res.json()
    } catch {
      // ignore parse error
    }
    const message =
      errorBody.message ||
      (errorBody.invalidFields
        ? Object.values(errorBody.invalidFields).join(', ')
        : `Erro ${res.status}: ${res.statusText}`)
    throw new ApiError(res.status, message, errorBody.invalidFields)
  }

  // Some endpoints return void on 200
  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json() as Promise<T>
  }
  return undefined as T
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public invalidFields?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const api = {
  listEvents: () => request<EventItem[]>('/event'),
  getEvent: (id: number) => request<EventItem>(`/event/${id}`),
  createEvent: (dto: EventDto) =>
    request<EventItem>('/event', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  patchEvent: (id: number, dto: EventDto) =>
    request<EventItem>(`/event/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
  deleteEvent: (id: number) =>
    request<void>(`/event/${id}`, { method: 'DELETE' }),
  duplicateEvent: (id: number) =>
    request<EventItem>(`/event/${id}/duplicate`, { method: 'POST' }),
  subscribe: (dto: SubscribeDto) =>
    request<void>('/event/subscribe', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  unsubscribe: (dto: SubscribeDto) =>
    request<void>('/event/unsubscribe', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  resetSubscriptions: (id: number) =>
    request<EventItem>(`/event/${id}/reset`, { method: 'PATCH' }),
  alternateStatus: (id: number) =>
    request<EventItem>(`/event/${id}/alternate`, { method: 'PATCH' }),
  countEvents: () => request<EventCount>('/event/events/count'),
  eventsToday: () => request<EventItem[]>('/event/events/today'),
  statistics: () => request<EventStatistics>('/event/events/statistics'),
  packedEvents: () => request<EventItem[]>('/event/events/packed'),
  notPackedEvents: () => request<EventItem[]>('/event/events/notPacked'),
  orderByDate: () => request<EventItem[]>('/event/events/order/date'),
}
