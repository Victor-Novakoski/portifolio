import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from '@/lib/motion'
import { makeSpark, stepSparks, type Spark } from '@/lib/sparks'

const EASE = 0.08
const SPARK_SPEED = 0.6
const SPARK_GAP_MS = 90
const MAX_SPARKS = 12

// O mouse como fonte de calor, só no hero: um brilho segue o ponteiro e, passando rápido
// pelo sobrenome, solta faíscas. Só com mouse de verdade e sem movimento reduzido.
export function useHeroHeat() {
  const heroRef = useRef<HTMLElement>(null)
  const heatRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const heat = heatRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!hero || !heat || !canvas || !ctx) return
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine) and (hover: hover)').matches) return

    const sparks: Spark[] = []
    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let last = { x: 0, y: 0, t: 0 }
    let lastSpark = 0
    let frame = 0
    let visible = true

    const size = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = hero.clientWidth * ratio
      canvas.height = hero.clientHeight * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = () => {
      pos.x += (target.x - pos.x) * EASE
      pos.y += (target.y - pos.y) * EASE
      heat.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`
      ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight)
      const alive = stepSparks(ctx, sparks)
      const settling = Math.abs(target.x - pos.x) > 0.5 || Math.abs(target.y - pos.y) > 0.5
      frame = visible && (settling || alive > 0) ? requestAnimationFrame(draw) : 0
    }
    const wake = () => {
      if (!frame && visible) frame = requestAnimationFrame(draw)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const box = hero.getBoundingClientRect()
      const x = event.clientX - box.left
      const y = event.clientY - box.top
      target.x = x
      target.y = y
      // Ao entrar, o brilho nasce sob o ponteiro em vez de atravessar a tela.
      if (!hero.classList.contains('warm')) {
        pos.x = x
        pos.y = y
        hero.classList.add('warm')
      }

      const now = performance.now()
      const speed = last.t ? Math.hypot(x - last.x, y - last.y) / Math.max(1, now - last.t) : 0
      last = { x, y, t: now }
      const name = hero.querySelector('.surname')?.getBoundingClientRect()
      const overName = name && event.clientX >= name.left && event.clientX <= name.right && event.clientY >= name.top && event.clientY <= name.bottom
      if (overName && speed > SPARK_SPEED && now - lastSpark > SPARK_GAP_MS && sparks.length < MAX_SPARKS) {
        lastSpark = now
        sparks.push(makeSpark(x, y, (Math.random() - 0.5) * 1.2, -(0.8 + Math.random() * 1.4), 30))
      }
      wake()
    }
    const onLeave = () => {
      hero.classList.remove('warm')
      last = { x: 0, y: 0, t: 0 }
    }

    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting)
      if (visible) wake()
    })

    size()
    observer.observe(hero)
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', size)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', size)
    }
  }, [])

  return { heroRef, heatRef, canvasRef }
}
