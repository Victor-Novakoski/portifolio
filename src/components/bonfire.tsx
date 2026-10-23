import { useEffect, useRef, useState } from 'react'

import { DownloadIcon } from '@/components/icons'
import { profile } from '@/data/profile'
import { stops } from '@/data/stops'
import { useJourney } from '@/hooks/use-journey'
import { prefersReducedMotion } from '@/lib/motion'

type Flame = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number }

const W = 200
const H = 220
const routePoints = stops.filter(stop => stop.id !== 'inicio').map(stop => stop.id)

const formatDuration = (ms: number) => {
  const seconds = Math.round(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  return `${minutes ? `${minutes}min ` : ''}${seconds % 60}s`
}

function drawLogs(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#5b4b31'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(48, 206)
  ctx.lineTo(152, 190)
  ctx.moveTo(52, 190)
  ctx.lineTo(150, 206)
  ctx.stroke()
  ctx.fillStyle = '#7a6440'
  ctx.fillRect(97, 120, 6, 80)
  ctx.save()
  ctx.translate(100, 132)
  ctx.rotate(-0.12)
  ctx.fillStyle = '#8a7a5a'
  ctx.fillRect(-2, -54, 4, 54)
  ctx.fillRect(-8, -54, 16, 5)
  ctx.restore()
}

function drawStillFire(ctx: CanvasRenderingContext2D) {
  const glow = ctx.createRadialGradient(100, 170, 2, 100, 160, 60)
  glow.addColorStop(0, 'rgba(255,236,190,.9)')
  glow.addColorStop(0.45, 'rgba(224,160,80,.55)')
  glow.addColorStop(1, 'rgba(140,47,42,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.ellipse(100, 160, 34, 58, 0, 0, Math.PI * 2)
  ctx.fill()
}

// Fim da rota: a fogueira acende quando metade da seção aparece, e a visita é dada como entregue.
export function Bonfire() {
  const { visited, startedAt, arrive } = useJourney()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [litAt, setLitAt] = useState<number | null>(null)
  const [copied, setCopied] = useState('')
  const lit = litAt !== null

  useEffect(() => {
    const section = sectionRef.current
    if (!section || lit || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.intersectionRatio >= 0.5)) return
        setLitAt(Date.now())
        arrive('contato')
      },
      { threshold: 0.5 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [lit, arrive])

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!section || !canvas || !ctx) return

    const ratio = window.devicePixelRatio || 1
    canvas.width = W * ratio
    canvas.height = H * ratio
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

    const still = () => {
      ctx.clearRect(0, 0, W, H)
      drawLogs(ctx)
      if (lit) drawStillFire(ctx)
    }
    if (prefersReducedMotion()) {
      still()
      return
    }

    const flames: Flame[] = []
    let frame = 0
    let visible = false

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      drawLogs(ctx)
      const rate = lit ? 5 : 1
      for (let k = 0; k < rate; k++) {
        flames.push({
          x: 100 + (Math.random() - 0.5) * (lit ? 46 : 16),
          y: 196,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(lit ? 1.3 + Math.random() * 1.6 : 0.5 + Math.random() * 0.5),
          life: 0,
          max: lit ? 46 + Math.random() * 30 : 24 + Math.random() * 12,
          r: lit ? 9 + Math.random() * 8 : 4 + Math.random() * 3,
        })
      }
      ctx.globalCompositeOperation = 'lighter'
      for (let i = flames.length - 1; i >= 0; i--) {
        const flame = flames[i]
        flame.life++
        flame.x += flame.vx + (100 - flame.x) * 0.012
        flame.y += flame.vy
        const alpha = 1 - flame.life / flame.max
        if (alpha <= 0) {
          flames.splice(i, 1)
          continue
        }
        const radius = flame.r * alpha + 1
        const glow = ctx.createRadialGradient(flame.x, flame.y, 0, flame.x, flame.y, radius)
        glow.addColorStop(0, `rgba(255,236,190,${(alpha * 0.55).toFixed(3)})`)
        glow.addColorStop(0.4, `rgba(224,160,80,${(alpha * 0.35).toFixed(3)})`)
        glow.addColorStop(1, 'rgba(140,47,42,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(flame.x, flame.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
      frame = requestAnimationFrame(draw)
    }
    // Só anima com a fogueira na tela e a aba visível.
    const sync = () => {
      cancelAnimationFrame(frame)
      frame = 0
      if (visible && !document.hidden) frame = requestAnimationFrame(draw)
    }

    still()
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting)
      sync()
    })
    observer.observe(section)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      cancelAnimationFrame(frame)
    }
  }, [lit])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied('e-mail copiado')
    } catch {
      const code = document.getElementById('email')
      const selection = window.getSelection()
      if (code && selection) {
        const range = document.createRange()
        range.selectNodeContents(code)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      setCopied('selecionado: use Ctrl+C')
    }
  }

  const points = routePoints.filter(id => visited.has(id)).length

  return (
    <section className={lit ? 'stop-sec bonfire lit' : 'stop-sec bonfire'} id="contato" ref={sectionRef}>
      <div className="wrap">
        <div className="firebox">
          <span className="halo" aria-hidden="true" />
          <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" />
        </div>
        <span className="arrival" role="status">
          {lit ? (
            <>
              <b>Entregue</b> · percurso de {formatDuration(litAt - startedAt)} · {points}/{routePoints.length} pontos
            </>
          ) : (
            `Ponto ${routePoints.length}/${routePoints.length} · Fogueira`
          )}
        </span>
        <h2>Contato</h2>
        <p className="sub">{profile.contactNote}</p>
        <div className="mail">
          <code id="email">{profile.email}</code>
          <button type="button" onClick={copyEmail}>
            Copiar e-mail
          </button>
          <a className="mail-link" href={`mailto:${profile.email}`}>
            Abrir e-mail
          </a>
        </div>
        <span className="copied" role="status" aria-live="polite">
          {copied}
        </span>
        <div className="actions">
          <a className="btn-main" href={profile.cvUrl} download>
            <DownloadIcon />
            Baixar currículo (PDF)
          </a>
          <a className="iconlink" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a className="iconlink" href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  )
}
