import { useEffect, useState } from 'react'

import { sections } from '@/data/sections'
import { prefersReducedMotion } from '@/lib/motion'
import { safeSet } from '@/lib/storage'

export const LAST_SECTION_KEY = 'forja.secao'

// Seção no meio da tela: acende o título dela (com um tranco de câmera) e marca o link do cabeçalho.
// Só a seção fica guardada, para o "Continuar em" de quem volta.
export function useCurrentSection() {
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el)
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('lit'))
      return
    }
    let first = true
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          safeSet(LAST_SECTION_KEY, el.id)
          setCurrent(el.id)
          if (el.classList.contains('lit')) return
          el.classList.add('lit')
          if (!first) jolt(el)
        })
        first = false
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return current
}

function jolt(section: HTMLElement) {
  const inner = section.querySelector<HTMLElement>('.inner')
  if (!inner?.animate || prefersReducedMotion() || document.documentElement.classList.contains('paused')) return
  inner.animate(
    [{ transform: 'translateY(10px) skewY(.6deg)' }, { transform: 'translateY(-3px)', offset: 0.55 }, { transform: 'none' }],
    { duration: 300, easing: 'ease-out' }
  )
}
