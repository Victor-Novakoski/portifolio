import type { ReactNode } from 'react'

import { stops } from '@/data/stops'

type SectionHeadProps = {
  stopId: string
  title: string
  children?: ReactNode
}

// O início não conta como parada: o sobrescrito vai de "Parada 1 de 6" a "Parada 6 de 6".
const sectionStops = stops.filter(stop => stop.id !== 'inicio')

export function SectionHead({ stopId, title, children }: SectionHeadProps) {
  const position = sectionStops.findIndex(stop => stop.id === stopId) + 1

  return (
    <div className="head">
      <span className="point">
        Parada {position} de {sectionStops.length}
      </span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}
