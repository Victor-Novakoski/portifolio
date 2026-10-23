import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

import { stops } from '@/data/stops'

export type JourneyEvent = {
  id: number
  stopId: string
  time: string
  text: string
  delivered?: boolean
}

type JourneyValue = {
  current: string
  visited: ReadonlySet<string>
  events: JourneyEvent[]
  startedAt: number
  arrive: (stopId: string) => void
}

const JourneyContext = createContext<JourneyValue | null>(null)

const clock = () => new Date().toTimeString().slice(0, 8)

// A visita é tratada como uma entrega: cada seção alcançada vira um evento no rastreio.
export function JourneyProvider({ children }: { children: ReactNode }) {
  const [startedAt] = useState(() => Date.now())
  const [current, setCurrent] = useState('inicio')
  const [visited, setVisited] = useState<ReadonlySet<string>>(() => new Set(['inicio']))
  const [events, setEvents] = useState<JourneyEvent[]>(() => [{ id: 0, stopId: 'inicio', time: clock(), text: 'Saiu da origem' }])
  const visitedRef = useRef(new Set(['inicio']))

  const arrive = useCallback((stopId: string) => {
    setCurrent(stopId)
    if (visitedRef.current.has(stopId)) return
    visitedRef.current.add(stopId)
    setVisited(new Set(visitedRef.current))

    const label = stops.find(stop => stop.id === stopId)?.label ?? stopId
    const delivered = stopId === 'contato'
    setEvents(list => [
      ...list,
      { id: list.length, stopId, time: clock(), text: delivered ? 'Entregue no contato' : `Chegou em ${label}`, delivered },
    ])
  }, [])

  const value = useMemo(() => ({ current, visited, events, startedAt, arrive }), [current, visited, events, startedAt, arrive])

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const value = useContext(JourneyContext)
  if (!value) throw new Error('useJourney precisa estar dentro de JourneyProvider')
  return value
}
