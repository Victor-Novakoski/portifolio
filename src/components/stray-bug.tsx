import { useEffect, useRef, useState } from 'react'

import { BugIcon } from '@/components/icons'
import { prefersReducedMotion, rnd } from '@/lib/motion'
import { runtime, STRAY_BUG_EVENT } from '@/lib/runtime'

// Um bug que atravessa a tela pelo rodapé: escapa de uma luta vencida ou aparece ao digitar "bug".
export function StrayBug() {
  const [bug, setBug] = useState(0)
  const [squashed, setSquashed] = useState(false)
  const caughtRef = useRef(false)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function onSpawn(e: Event) {
      // Depois que a pessoa pega um, as lutas não soltam outro; o segredo "bug" sempre solta.
      if ((e as CustomEvent<string>).detail === 'luta' && caughtRef.current) return
      setBug(prev => prev || Date.now())
    }
    window.addEventListener(STRAY_BUG_EVENT, onSpawn)
    return () => window.removeEventListener(STRAY_BUG_EVENT, onSpawn)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!bug || !el || squashed) return
    const gone = () => setBug(0)
    if (prefersReducedMotion()) {
      el.style.left = '16px'
      const t = window.setTimeout(gone, 12000)
      return () => window.clearTimeout(t)
    }
    let x = -44
    let last = performance.now()
    let rest = 0
    let nextRest = rnd(900, 1800)
    let raf = 0
    function move(now: number) {
      const dt = Math.min(50, now - last)
      last = now
      if (!runtime.get().paused) {
        if (rest > 0) rest -= dt
        else {
          x += dt * 0.11
          nextRest -= dt
          if (nextRest <= 0) {
            rest = rnd(350, 750)
            nextRest = rnd(900, 1800)
          }
        }
        el!.style.left = `${x}px`
        el!.style.transform = `translateY(${(Math.sin(x / 22) * 8).toFixed(1)}px)`
      }
      if (x > window.innerWidth - 48) return gone()
      raf = requestAnimationFrame(move)
    }
    raf = requestAnimationFrame(move)
    return () => cancelAnimationFrame(raf)
  }, [bug, squashed])

  useEffect(() => {
    if (!squashed) return
    const t = window.setTimeout(() => {
      setBug(0)
      setSquashed(false)
    }, 900)
    return () => window.clearTimeout(t)
  }, [squashed])

  if (!bug) return null
  return (
    <button
      key={bug}
      ref={ref}
      type="button"
      className={`bug${squashed ? ' squash' : ''}`}
      aria-label={squashed ? 'Bug caçado' : 'Bug fugindo pela tela: clique para caçar'}
      onClick={() => {
        if (squashed) return
        caughtRef.current = true
        setSquashed(true)
      }}
    >
      <BugIcon split />
    </button>
  )
}
