import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from '@/lib/motion'

// Só anima o que começa abaixo da dobra: quem já está na tela não fica esperando a animação.
export function useReveal<T extends HTMLElement>(onReveal?: (el: T) => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return
    if (el.getBoundingClientRect().top <= window.innerHeight) return

    el.classList.add('pre')
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        onReveal?.(el)
        el.classList.remove('pre')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -20% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onReveal])

  return ref
}
