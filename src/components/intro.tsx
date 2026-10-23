import { useEffect, useRef, useState } from 'react'

import { endIntro, introIsRunning, introIsShort, LAND_EVENT } from '@/lib/motion'
import { makeSpark, stepSparks, type Spark } from '@/lib/sparks'

const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const
const TRAIL = 8

// Linhas do tempo da abertura, em ms (acompanham os atrasos do brasa.css). Quem volta ganha a curta.
const TIMELINES = {
  full: { kindle: { start: 650, duration: 1000 }, flareAt: 1650, flareSparks: 24, flight: { start: 1750, duration: 600 }, endAt: 3000, hardStop: 3600 },
  short: { kindle: null, flareAt: 120, flareSparks: 16, flight: { start: 300, duration: 500 }, endAt: 1200, hardStop: 1800 },
}

const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3)
const easeInOutCubic = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)

type Point = { x: number; y: number }

// Onde a brasa pousa: a primeira parada do trilho no desktop, ou o começo da barra de rota no celular.
function landingPoint(): Point | null {
  const stop = document.querySelector('.rail li:first-child .stop')?.getBoundingClientRect()
  if (stop && stop.width > 0) return { x: stop.left + stop.width / 2, y: stop.top + stop.height / 2 }
  const bar = document.querySelector('.routebar')?.getBoundingClientRect()
  if (bar && bar.width > 0) return { x: bar.left + 4, y: bar.top + bar.height / 2 }
  return null
}

// Abertura: uma faixa quente percorre o nome soltando faíscas, o nome explode em luz,
// e a brasa sai do "I" de NOVAKOSKI e voa até a primeira parada da rota.
export function Intro() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [running, setRunning] = useState(introIsRunning)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!running || !canvas || !ctx) return

    const { kindle, flareAt, flareSparks, flight, endAt, hardStop } = TIMELINES[introIsShort() ? 'short' : 'full']
    const sparks: Spark[] = []
    const trail: Point[] = []
    let flared = false
    let landed = false
    let frame = 0
    let done = false
    let from: Point | null = null
    let to: Point | null = null

    const size = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const finish = () => {
      if (done) return
      done = true
      cancelAnimationFrame(frame)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      endIntro()
      setRunning(false)
      if (!landed) window.dispatchEvent(new Event(LAND_EVENT))
    }

    size()
    const surname = document.querySelector('.surname')
    const start = performance.now()

    const draw = (now: number) => {
      const t = now - start
      const box = surname?.getBoundingClientRect()

      // A frente da faixa quente solta duas faíscas por quadro.
      if (box && kindle && t > kindle.start && t < kindle.start + kindle.duration) {
        const front = box.left + easeOutCubic((t - kindle.start) / kindle.duration) * box.width
        for (let k = 0; k < 2; k++) {
          sparks.push(
            makeSpark(front + (Math.random() - 0.5) * 12, box.top + box.height * (0.25 + Math.random() * 0.65), (Math.random() - 0.5) * 0.8, -(0.8 + Math.random() * 1.6), 50 + Math.random() * 40)
          )
        }
      }

      // Ignição: o nome todo explode em luz.
      if (box && !flared && t >= flareAt) {
        flared = true
        for (let k = 0; k < flareSparks; k++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 1 + Math.random() * 2.4
          const heavy = Math.random() < 0.2
          sparks.push(
            makeSpark(box.left + Math.random() * box.width, box.top + box.height * (0.3 + Math.random() * 0.5), Math.cos(angle) * speed, Math.sin(angle) * speed - 0.8, 40 + Math.random() * 40, heavy ? 0.04 : 0)
          )
        }
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // O pacote: a brasa voa numa curva até a primeira parada, deixando rastro.
      if (box && t >= flight.start && !landed) {
        from ??= { x: box.right - box.height * 0.1, y: box.top + box.height * 0.45 }
        to ??= landingPoint()
        if (!to) {
          landed = true
        } else {
          const k = Math.min(1, (t - flight.start) / flight.duration)
          const e = easeInOutCubic(k)
          const control = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 140 }
          const x = (1 - e) * (1 - e) * from.x + 2 * (1 - e) * e * control.x + e * e * to.x
          const y = (1 - e) * (1 - e) * from.y + 2 * (1 - e) * e * control.y + e * e * to.y
          trail.unshift({ x, y })
          trail.length = Math.min(trail.length, TRAIL)
          ctx.globalCompositeOperation = 'lighter'
          trail.forEach((point, i) => {
            const alpha = 1 - i / TRAIL
            const radius = 7 * alpha + 1
            const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius)
            glow.addColorStop(0, `rgba(255,243,201,${(alpha * 0.9).toFixed(3)})`)
            glow.addColorStop(0.5, `rgba(224,188,116,${(alpha * 0.5).toFixed(3)})`)
            glow.addColorStop(1, 'rgba(199,162,93,0)')
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
            ctx.fill()
          })
          ctx.globalCompositeOperation = 'source-over'
          if (k >= 1) {
            landed = true
            window.dispatchEvent(new Event(LAND_EVENT))
            for (let n = 0; n < 10; n++) {
              sparks.push(makeSpark(to.x, to.y, 0.2 + Math.random() * 1.4, -(0.6 + Math.random() * 1.6), 30 + Math.random() * 10, 0.03))
            }
          }
        }
      }

      stepSparks(ctx, sparks)

      if (t < hardStop && (t < endAt || sparks.length)) frame = requestAnimationFrame(draw)
      else finish()
    }
    frame = requestAnimationFrame(draw)

    // Espera um instante para o clique que abriu a página não encerrar a abertura.
    const listen = window.setTimeout(() => {
      SKIP_EVENTS.forEach(name => window.addEventListener(name, finish, { passive: true }))
    }, 50)
    window.addEventListener('resize', size)

    return () => {
      window.clearTimeout(listen)
      cancelAnimationFrame(frame)
      SKIP_EVENTS.forEach(name => window.removeEventListener(name, finish))
      window.removeEventListener('resize', size)
    }
  }, [running])

  return (
    <>
      <canvas id="sparks" ref={canvasRef} aria-hidden="true" />
      {running && (
        <button className="skip-intro" type="button" onClick={() => { endIntro(); setRunning(false) }}>
          pular abertura
        </button>
      )}
    </>
  )
}
