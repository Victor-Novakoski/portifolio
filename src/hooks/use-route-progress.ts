import { useEffect } from 'react'

import { stops } from '@/data/stops'
import { useJourney } from '@/hooks/use-journey'

// Escreve o progresso da rota em --route (trilho, brasa viajante e barra de rota leem dali)
// e avisa a jornada quando o visitante chega numa nova seção.
export function useRouteProgress() {
  const { current, arrive } = useJourney()

  useEffect(() => {
    const root = document.documentElement
    const sections = stops
      .map(stop => document.getElementById(stop.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length < 2) return

    let frame = 0
    const update = () => {
      frame = 0
      const probe = window.scrollY + window.innerHeight * 0.4
      let index = 0
      sections.forEach((section, i) => {
        if (section.offsetTop <= probe) index = i
      })
      const atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 40
      if (atBottom) index = sections.length - 1

      const here = sections[index]
      const next = sections[index + 1]
      const fraction = next ? Math.min(1, Math.max(0, (probe - here.offsetTop) / (next.offsetTop - here.offsetTop))) : 0
      root.style.setProperty('--route', `${(((index + fraction) / (sections.length - 1)) * 100).toFixed(2)}%`)
      if (here.id !== current) arrive(here.id)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [current, arrive])
}
