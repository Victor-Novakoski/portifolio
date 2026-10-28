import { prefersReducedMotion, rnd } from '@/lib/motion'

// Destroços com gravidade: pedacinhos que saltam do golpe, quicam no chão da arena e somem.
type Shard = { el: HTMLElement; x: number; y: number; vx: number; vy: number; r: number; vr: number; ground: number; life: number }

const shards: Shard[] = []
let raf = 0

export function debris(host: HTMLElement, x: number, y: number, color: string, count: number, ground: number) {
  if (prefersReducedMotion()) return
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    const w = rnd(3, 8)
    el.className = 'shard'
    el.style.width = `${w}px`
    el.style.height = `${w * rnd(0.4, 1)}px`
    el.style.background = color
    host.appendChild(el)
    shards.push({ el, x, y, vx: rnd(-6, 6), vy: rnd(-10, -3), r: rnd(0, 90), vr: rnd(-25, 25), ground, life: rnd(60, 90) })
  }
  if (!raf) raf = requestAnimationFrame(step)
}

function step() {
  raf = 0
  for (let i = shards.length - 1; i >= 0; i--) {
    const s = shards[i]
    s.vy += 0.55
    s.x += s.vx
    s.y += s.vy
    s.r += s.vr
    if (s.y > s.ground) {
      s.y = s.ground
      s.vy *= -0.45
      s.vx *= 0.7
      s.vr *= 0.5
    }
    s.life--
    s.el.style.transform = `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px) rotate(${s.r.toFixed(0)}deg)`
    s.el.style.opacity = String(s.life < 20 ? Math.max(0, s.life / 20) : 1)
    if (s.life <= 0 || !s.el.isConnected) {
      s.el.remove()
      shards.splice(i, 1)
    }
  }
  if (shards.length) raf = requestAnimationFrame(step)
}
