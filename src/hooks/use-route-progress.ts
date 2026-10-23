import { useEffect } from 'react'

import { stops } from '@/data/stops'
import { useJourney } from '@/hooks/use-journey'

const IDLE_MS = 150

// Escreve o progresso da rota em CSS: --route (porcentagem, barra do celular), --p (0 a 1, trilho e brasa)
// e --v (velocidade de 0 a 1, cauda da brasa). Também avisa a jornada quando o visitante chega numa seção.
export function useRouteProgress() {
  const { current, arrive } = useJourney()

  useEffect(() => {
    const root = document.documentElement
    const sections = stops
      .map(stop => document.getElementById(stop.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length < 2) return

    let frame = 0
    let idle = 0
    let lastY = window.scrollY
    let lastT = performance.now()

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
      const progress = (index + fraction) / (sections.length - 1)
      root.style.setProperty('--route', `${(progress * 100).toFixed(2)}%`)
      root.style.setProperty('--p', progress.toFixed(4))
      if (here.id !== current) arrive(here.id)
    }

    const onScroll = () => {
      const now = performance.now()
      const dy = window.scrollY - lastY
      const speed = Math.min(1, Math.abs(dy) / Math.max(1, now - lastT) / 3)
      lastY = window.scrollY
      lastT = now
      if (dy !== 0) root.dataset.scroll = dy < 0 ? 'up' : 'down'
      root.style.setProperty('--v', speed.toFixed(2))
      root.classList.add('scrolling')
      window.clearTimeout(idle)
      idle = window.setTimeout(() => {
        root.classList.remove('scrolling')
        root.style.setProperty('--v', '0')
      }, IDLE_MS)
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onResize = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(idle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [current, arrive])
}
