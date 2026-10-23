import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/motion'

const nodes = [
  { label: 'motorista', x: 10, width: 85 },
  { label: 'api B', x: 170, width: 95 },
  { label: 'redis', x: 280, width: 95 },
  { label: 'api A', x: 390, width: 95 },
  { label: 'cliente', x: 500, width: 130 },
]
const centers = nodes.map(node => node.x + node.width / 2)
const steps = ['motorista atualiza pela API B', 'API B publica no Redis', 'Redis entrega à API A', 'API A empurra pelo WebSocket']
const statuses = ['coletado', 'em rota', 'entregue']
const SEGMENT_MS = 520

const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)

// Um evento saindo da instância B e chegando ao cliente conectado na instância A.
export function EventDiagram() {
  const packetRef = useRef<SVGCircleElement>(null)
  const frameRef = useRef(0)
  const timeoutRef = useRef(0)
  const sentRef = useRef(0)
  const [hit, setHit] = useState(-1)
  const [busy, setBusy] = useState(false)
  const [clientStatus, setClientStatus] = useState('aguardando')
  const [log, setLog] = useState('Clique para ver um evento atravessar as instâncias.')

  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current)
      window.clearTimeout(timeoutRef.current)
    },
    []
  )

  const send = () => {
    const packet = packetRef.current
    if (busy || !packet) return
    const status = statuses[sentRef.current++ % statuses.length]

    if (prefersReducedMotion()) {
      setClientStatus(status)
      setLog(`Status "${status}" chegou ao cliente pela outra instância.`)
      return
    }

    setBusy(true)
    setHit(0)
    setLog(`${steps[0]}…`)
    packet.setAttribute('opacity', '1')
    let segment = 0
    let start: number | null = null

    const step = (now: number) => {
      start ??= now
      const k = Math.min(1, (now - start) / SEGMENT_MS)
      packet.setAttribute('cx', String(centers[segment] + (centers[segment + 1] - centers[segment]) * ease(k)))
      if (k < 1) {
        frameRef.current = requestAnimationFrame(step)
        return
      }
      segment++
      setHit(segment)
      if (segment < centers.length - 1) {
        setLog(`${steps[segment]}…`)
        start = null
        frameRef.current = requestAnimationFrame(step)
        return
      }
      setClientStatus(status)
      setLog(`Status "${status}" chegou ao cliente sem recarregar a página.`)
      timeoutRef.current = window.setTimeout(() => {
        packet.setAttribute('opacity', '0')
        packet.setAttribute('cx', String(centers[0]))
        setHit(-1)
        setBusy(false)
      }, 600)
    }
    frameRef.current = requestAnimationFrame(step)
  }

  return (
    <div className="diagram">
      <svg viewBox="0 0 640 150" role="img" aria-labelledby="dg-t">
        <title id="dg-t">Caminho de um evento: motorista, API B, Redis, API A, cliente</title>
        <path className="wire" d="M95 75 H170 M265 75 H280 M375 75 H390 M485 75 H500" />
        {nodes.map((node, i) => (
          <g key={node.label} className={hit === i ? 'node hit' : 'node'}>
            <rect x={node.x} y={50} width={node.width} height={50} rx={2} />
            <text x={centers[i]} y={i === nodes.length - 1 ? 72 : 80} textAnchor="middle">
              {node.label}
            </text>
            {i === nodes.length - 1 && (
              <text x={centers[i]} y={90} textAnchor="middle" className="client-status">
                {clientStatus}
              </text>
            )}
          </g>
        ))}
        <circle ref={packetRef} cx={centers[0]} cy={75} r={6} fill="#E0BC74" opacity={0} />
      </svg>
      <div className="bar">
        <button type="button" onClick={send} disabled={busy}>
          Mudar status da entrega
        </button>
        <span className="log" role="status">
          {log}
        </span>
      </div>
    </div>
  )
}
