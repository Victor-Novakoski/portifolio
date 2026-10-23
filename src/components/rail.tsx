import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

import { stops } from '@/data/stops'
import { useJourney } from '@/hooks/use-journey'
import { LAND_EVENT, prefersReducedMotion } from '@/lib/motion'
import { makeSpark, stepSparks, type Spark } from '@/lib/sparks'
import { formatElapsed } from '@/lib/visits'

const IGNITE_MS = 520
const FRESH_MS = 1600
const BUMP_MS = 200
const WAVE_MS = 1400
const STOP_X = 27.5

type Pulse = { id: string; kind: 'ignite' | 'bump' } | null

// Trilho de brasas (desktop) e barra de rota (celular). As duas leem a posição de --route/--p;
// cada primeira chegada acende a parada com faíscas e mostra o tempo desde o início da visita, como no Rastreia.
export function Rail() {
  const { current, visited, events, startedAt } = useJourney()
  const [pulse, setPulse] = useState<Pulse>(null)
  const [fresh, setFresh] = useState<string | null>(null)
  const [wave, setWave] = useState(false)
  const seenRef = useRef(new Set(['inicio']))
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const frameRef = useRef(0)

  const burst = useCallback((stopId: string) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || prefersReducedMotion() || canvas.clientHeight === 0) return

    const ratio = window.devicePixelRatio || 1
    if (canvas.width !== canvas.clientWidth * ratio || canvas.height !== canvas.clientHeight * ratio) {
      canvas.width = canvas.clientWidth * ratio
      canvas.height = canvas.clientHeight * ratio
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

    const index = stops.findIndex(stop => stop.id === stopId)
    const y = (index / (stops.length - 1)) * canvas.clientHeight
    const count = 10 + Math.floor(Math.random() * 5)
    for (let i = 0; i < count; i++) {
      sparksRef.current.push(makeSpark(STOP_X, y, 0.3 + Math.random() * 1.4, -(0.6 + Math.random() * 1.8), 30 + Math.random() * 10, 0.03))
    }

    if (frameRef.current) return
    const draw = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      frameRef.current = stepSparks(ctx, sparksRef.current) > 0 && !document.hidden ? requestAnimationFrame(draw) : 0
      if (!frameRef.current) {
        sparksRef.current.length = 0
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      }
    }
    frameRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const ignite = useCallback(
    (stopId: string) => {
      setPulse({ id: stopId, kind: 'ignite' })
      setFresh(stopId)
      burst(stopId)
    },
    [burst]
  )

  // Chegou numa parada: na primeira vez, ignição; nas próximas, só um toque.
  useEffect(() => {
    if (seenRef.current.has(current)) {
      if (current !== 'inicio' || seenRef.current.size > 1) setPulse({ id: current, kind: 'bump' })
      return
    }
    seenRef.current.add(current)
    ignite(current)
    if (current === 'contato') setWave(true)
  }, [current, ignite])

  // A brasa da abertura pousa no Início.
  useEffect(() => {
    const onLand = () => ignite('inicio')
    window.addEventListener(LAND_EVENT, onLand)
    return () => window.removeEventListener(LAND_EVENT, onLand)
  }, [ignite])

  useEffect(() => {
    if (!pulse) return
    const timer = window.setTimeout(() => setPulse(null), pulse.kind === 'ignite' ? IGNITE_MS : BUMP_MS)
    return () => window.clearTimeout(timer)
  }, [pulse])

  useEffect(() => {
    if (!fresh) return
    const timer = window.setTimeout(() => setFresh(null), FRESH_MS)
    return () => window.clearTimeout(timer)
  }, [fresh])

  useEffect(() => {
    if (!wave) return
    const timer = window.setTimeout(() => setWave(false), WAVE_MS)
    return () => window.clearTimeout(timer)
  }, [wave])

  const delivered = visited.has('contato')
  const flashing = pulse?.kind === 'ignite'

  return (
    <>
      <div className={['routebar', delivered && 'delivered', flashing && 'flash'].filter(Boolean).join(' ')} aria-hidden="true">
        <span className="fill" />
        {stops.map((stop, i) => (
          <span
            key={stop.id}
            className={['mark', visited.has(stop.id) && 'lit', flashing && pulse.id === stop.id && 'hit'].filter(Boolean).join(' ')}
            style={{ left: `${(i / (stops.length - 1)) * 100}%` }}
          />
        ))}
      </div>
      <nav className={['rail', delivered && 'delivered', wave && 'wave'].filter(Boolean).join(' ')} aria-label="Trilho de brasas">
        <span className="line" />
        <span className="line-lit" />
        <canvas className="sparks" ref={canvasRef} aria-hidden="true" />
        <ol>
          {stops.map((stop, i) => {
            const classes = [
              visited.has(stop.id) && 'lit',
              current === stop.id && 'current',
              pulse?.id === stop.id && pulse.kind,
              fresh === stop.id && 'fresh',
            ]
              .filter(Boolean)
              .join(' ')
            const event = events.find(item => item.stopId === stop.id)
            const time = event && formatElapsed(event.at - startedAt)
            return (
              <li key={stop.id} style={{ top: `${(i / (stops.length - 1)) * 100}%`, '--i': i } as CSSProperties}>
                <a href={`#${stop.id}`} className={classes || undefined} aria-current={current === stop.id ? 'true' : undefined}>
                  <span className="stop" />
                  <span className="name">
                    {stop.label}
                    {time && (
                      <small className="arrived" aria-hidden="true">
                        {stop.id === 'inicio' ? 'saiu' : 'chegou'} {time}
                      </small>
                    )}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
        <span className="traveler" aria-hidden="true" />
      </nav>
    </>
  )
}
