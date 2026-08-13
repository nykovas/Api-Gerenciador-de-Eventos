export type EventStatus = 'OPEN' | 'CLOSED'

export interface EventItem {
  id: number
  name: string
  description: string
  localization: string
  date: string
  maxCapacity: number
  subscribers: number
  status: EventStatus
}

export interface EventDto {
  name: string
  description: string
  localization: string
  date: string
  maxCapacity: number
  subscribers: number
}

export interface SubscribeDto {
  eventId: number
  participant: number
}

export interface EventCount {
  total: number
}

export interface EventStatistics {
  totalEvents: number
  openEvents: number
  closedEvents: number
  totalSubscribers: number
  averageSubscribers: number
}

export interface ErrorResponse {
  timeStamp?: string
  status?: number
  message?: string
  invalidFields?: Record<string, string>
}
