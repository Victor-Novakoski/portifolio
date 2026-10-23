import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

import { stops } from '@/data/stops'
import { formatAgo, markDelivered, startVisit, type LastVisit } from '@/lib/visits'

export type JourneyEvent = {
  id: number
  stopId: string
  at: number
  text: string
  delivered?: boolean
}

type JourneyValue = {
  current: string
  visited: ReadonlySet<string>
  events: JourneyEvent[]
  startedAt: number
  previous: LastVisit | null
  arrive: (stopId: string) => void
}

const JourneyContext = createContext<JourneyValue | null>(null)

const firstEvent = (startedAt: number, previous: LastVisit | null): JourneyEvent => ({
  id: 0,
  stopId: 'inicio',
  at: startedAt,
  text: previous
    ? `Retorno · última visita ${formatAgo(startedAt - previous.at)}${previous.delivered ? ' · entregue' : ''}`
    : 'Saiu da origem',
})

// A visita é tratada como uma entrega: cada seção alcançada vira um evento no rastreio.
export function JourneyProvider({ children }: { children: ReactNode }) {
  const [startedAt] = useState(() => Date.now())
  const [previous] = useState(startVisit)
  const [current, setCurrent] = useState('inicio')
  const [visited, setVisited] = useState<ReadonlySet<string>>(() => new Set(['inicio']))
  const [events, setEvents] = useState<JourneyEvent[]>(() => [firstEvent(startedAt, previous)])
  const visitedRef = useRef(new Set(['inicio']))

  const arrive = useCallback((stopId: string) => {
    setCurrent(stopId)
    if (visitedRef.current.has(stopId)) return
    visitedRef.current.add(stopId)
    setVisited(new Set(visitedRef.current))

    const label = stops.find(stop => stop.id === stopId)?.label ?? stopId
    const delivered = stopId === 'contato'
    if (delivered) markDelivered()
    setEvents(list => [
      ...list,
      { id: list.length, stopId, at: Date.now(), text: delivered ? 'Entregue no contato' : `Chegou em ${label}`, delivered },
    ])
  }, [])

  const value = useMemo(
    () => ({ current, visited, events, startedAt, previous, arrive }),
    [current, visited, events, startedAt, previous, arrive]
  )

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const value = useContext(JourneyContext)
  if (!value) throw new Error('useJourney precisa estar dentro de JourneyProvider')
  return value
}
