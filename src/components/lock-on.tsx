import { useEffect, useRef } from 'react'

import { isCoarsePointer, prefersReducedMotion } from '@/lib/motion'

// Mira de lock-on: com mouse, desliza até o clicável mais próximo; no toque, marca o título no meio da tela
// durante a rolagem. Nunca troca o cursor nem cobre texto (pointer-events: none), e some com movimento reduzido.
export function LockOn() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const lock = ref.current!
    const coarse = isCoarsePointer()
    let lx = -1
    let ly = -1
    let raf = 0
    let hideT = 0

    const visible = (el: Element) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight ? r : null
    }
    const put = (x: number, y: number) => {
      lock.style.transform = `translate(${x}px,${y}px)`
      lock.classList.add('on')
    }
    const off = () => lock.classList.remove('on')

    function tick() {
      raf = 0
      if (coarse) {
        const cy = window.innerHeight / 2
        let best: DOMRect | null = null
        let bd = 1e9
        document.querySelectorAll('.sec-h, .boss-head h3, .item h3').forEach(h => {
          const r = visible(h)
          if (!r) return
          const d = Math.abs(r.top + r.height / 2 - cy)
          if (d < bd) {
            bd = d
            best = r
          }
        })
        const b = best as DOMRect | null
        if (b && bd < window.innerHeight * 0.35) put(Math.max(10, b.left - 12), b.top + Math.min(b.height, 40) / 2)
        else off()
        window.clearTimeout(hideT)
        hideT = window.setTimeout(off, 900)
        return
      }
      if (lx < 0) return
      let best: DOMRect | null = null
      let bd = 1e9
      document.querySelectorAll('a[href], button, input').forEach(el => {
        if (el.classList.contains('skip') || el.closest('dialog')) return
        const r = visible(el)
        if (!r) return
        const dx = Math.max(r.left - lx, 0, lx - r.right)
        const dy = Math.max(r.top - ly, 0, ly - r.bottom)
        const d = dx * dx + dy * dy
        if (d < bd) {
          bd = d
          best = r
        }
      })
      const b = best as DOMRect | null
      if (b && bd < 110 * 110) {
        let x = b.left - 14
        if (x < 10) x = b.right + 14
        put(x, b.top + b.height / 2)
      } else off()
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    function onMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
      lx = e.clientX
      ly = e.clientY
      schedule()
    }
    function onLeave() {
      lx = -1
      off()
    }

    window.addEventListener('scroll', schedule, { passive: true })
    if (!coarse) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('mouseleave', onLeave)
    }
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(hideT)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="lock" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="6" fill="none" stroke="#E3C17A" strokeWidth="1.5" />
        <path d="M9 0v4M9 14v4M0 9h4M14 9h4" stroke="#E3C17A" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="1.5" fill="#E3C17A" />
      </svg>
    </div>
  )
}
