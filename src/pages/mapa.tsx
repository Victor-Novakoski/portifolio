import { useEffect } from 'react'

import { useProgress } from '@/app/providers/progress-provider'
import { WorldMap } from '@/components/map/world-map'

export function MapaPage() {
  const { visitArea } = useProgress()

  useEffect(() => {
    visitArea('map')
  }, [visitArea])

  return (
    <section className="flex min-h-screen w-full items-center justify-center px-3 py-6 md:px-5">
      <WorldMap />
    </section>
  )
}
