import { prefersReducedMotion, rnd } from '@/lib/motion'
import { runtime } from '@/lib/runtime'

// Tela de título: céu, lua, montanhas, névoa e brasas num canvas, e por cima, noutro canvas,
// a lanterna pendurada numa corda (Verlet) e o chapéu do caçador, que dá para pegar e arremessar.
// Portado do protótipo "Forja do Caçador" quase sem mudança de lógica.

type Point = { x: number; y: number }
type Ember = Point & { vx: number; vy: number; r: number; p: number }
type Fog = Point & { r: number; v: number }
type Ridge = { c: string; pts: Array<[number, number]> }
type RopeNode = Point & { ox: number; oy: number }
type Grab = 'hat' | 'lamp' | null

export type TitleScene = {
  destroy(): void
  throwHat(): void
  swingLamp(): void
  tipHat(): void
}

type Options = {
  sky: HTMLCanvasElement
  props: HTMLCanvasElement
  hud: HTMLElement
  onHatNote(): void
}

const TAU = Math.PI * 2

export function mountTitleScene(title: HTMLElement, { sky, props, hud, onHatNote }: Options): TitleScene {
  const reduce = prefersReducedMotion()
  const ctx = sky.getContext('2d')
  const pctx = props.getContext('2d')
  const noop = () => {}
  if (!ctx) return { destroy: noop, throwHat: noop, swingLamp: noop, tipHat: onHatNote }

  let W = 0
  let H = 0
  let DPR = 1
  let lastWidth = -1
  let embers: Ember[] = []
  let fog: Fog[] = []
  let ridges: Ridge[] = []
  const pt = { x: -999, y: -999 }
  let raf = 0
  const t0 = performance.now()
  let visible = true
  let hatT0 = -99
  let hatBox: { x: number; y: number; rx: number; ry: number } | null = null
  let forceLift: number | null = null
  let skyS = 1
  const timers: number[] = []

  // ---------- Céu ----------
  function build() {
    const r = title.getBoundingClientRect()
    DPR = Math.min(window.devicePixelRatio || 1, 1.5)
    W = Math.max(1, r.width)
    H = Math.max(1, r.height)
    sky.width = Math.round(W * DPR)
    sky.height = Math.round(H * DPR)
    ctx!.setTransform(DPR, 0, 0, DPR, 0, 0)
    // No celular a barra de endereço muda só a altura: aí o cenário fica, para as montanhas não pularem.
    if (r.width === lastWidth && ridges.length) return
    lastWidth = r.width
    const n = W < 700 ? 38 : 80
    embers = []
    for (let i = 0; i < n; i++) embers.push({ x: rnd(0, W), y: rnd(0, H), vx: 0, vy: -rnd(0.15, 0.6), r: rnd(0.8, 2.2), p: rnd(0, 6.28) })
    fog = []
    for (let j = 0; j < 6; j++) fog.push({ x: rnd(0, W), y: rnd(H * 0.55, H), r: rnd(160, 320), v: rnd(0.08, 0.25) })
    ridges = [
      { c: '#141219', h: 0.3, s: 46 },
      { c: '#0B0A0F', h: 0.2, s: 30 },
    ].map((layer, k) => {
      const pts: Array<[number, number]> = []
      let x = -20
      while (x < W + 40) {
        const w = rnd(layer.s * 0.6, layer.s * 1.4)
        const base = H * (1 - layer.h) + rnd(-12, 12)
        pts.push([x, base], [x + w * 0.5, base - rnd(20, k ? 50 : 90)], [x + w, base])
        x += w
      }
      return { c: layer.c, pts }
    })
  }

  function hatLift(t: number) {
    if (forceLift !== null) return forceLift
    const d = t - hatT0
    return d >= 0 && d < 1.6 ? Math.sin((Math.PI * d) / 1.6) : 0
  }

  function hunter(x: number, y: number, s: number, t: number) {
    const c = ctx!
    const a = Math.sin(t * 1.3) * 6
    const b = Math.sin(t * 1.7 + 1) * 5
    const w = Math.sin(t * 2.1) * 6
    c.save()
    c.translate(x, y)
    c.scale(s, s)
    c.fillStyle = '#050407'
    c.beginPath()
    c.moveTo(-18, 0); c.lineTo(-14, -72); c.lineTo(-4, -72); c.lineTo(-6, 0); c.closePath()
    c.moveTo(6, 0); c.lineTo(4, -72); c.lineTo(14, -72); c.lineTo(20, 0); c.closePath()
    c.moveTo(-12, -308); c.lineTo(-40, -290); c.quadraticCurveTo(-44, -240, -30, -200); c.lineTo(-50 - a, -72); c.lineTo(-22, -90 + b * 0.3)
    c.lineTo(-8, -62); c.lineTo(8, -90); c.lineTo(24, -64); c.lineTo(48 + b, -76); c.lineTo(30, -200); c.quadraticCurveTo(44, -240, 40, -290); c.lineTo(12, -308); c.closePath()
    c.moveTo(-18, -300); c.lineTo(-24, -330); c.lineTo(-6, -316); c.closePath()
    c.moveTo(18, -300); c.lineTo(24, -330); c.lineTo(6, -316); c.closePath()
    c.moveTo(36, -288); c.quadraticCurveTo(52, -240, 54, -190); c.lineTo(44, -188); c.quadraticCurveTo(40, -235, 28, -270); c.closePath()
    c.moveTo(-36, -288); c.quadraticCurveTo(-54, -245, -56, -200); c.lineTo(-46, -198); c.quadraticCurveTo(-42, -240, -28, -270); c.closePath()
    c.moveTo(6, -312); c.bezierCurveTo(-30, -310 + w, -60, -300 - w, -96, -306 + w * 1.5); c.lineTo(-92, -296 + w); c.bezierCurveTo(-60, -290, -30, -298, 6, -300); c.closePath()
    c.fill()
    c.beginPath(); c.arc(0, -322, 13, 0, TAU); c.fill()
    c.strokeStyle = 'rgba(169,214,229,.55)'; c.lineWidth = 4; c.lineCap = 'round'
    c.beginPath(); c.moveTo(50, -190); c.lineTo(96, -16); c.stroke()
    c.strokeStyle = '#050407'; c.lineWidth = 2; c.beginPath(); c.moveTo(-52, -198); c.lineTo(-52, -184); c.stroke()
    const g = c.createRadialGradient(-52, -172, 2, -52, -172, 60 + Math.sin(t * 3) * 4)
    g.addColorStop(0, 'rgba(227,193,122,.55)'); g.addColorStop(1, 'rgba(227,193,122,0)')
    c.fillStyle = g; c.beginPath(); c.arc(-52, -172, 64, 0, TAU); c.fill()
    c.fillStyle = '#E3C17A'; c.fillRect(-59, -182, 14, 20)
    const L = hatLift(t)
    if (!hatFree) {
      c.save()
      c.translate(20 * L, -334 - 48 * L)
      c.rotate(-0.06 - 0.45 * L)
      c.fillStyle = '#050407'
      c.beginPath(); c.moveTo(-20, 0); c.quadraticCurveTo(-22, -38, 0, -42); c.quadraticCurveTo(22, -38, 20, 0); c.closePath(); c.fill()
      c.beginPath(); c.ellipse(0, 0, 50, 7, 0, 0, TAU); c.fill()
      if (L > 0) {
        c.strokeStyle = `rgba(227,193,122,${(0.7 * L).toFixed(2)})`; c.lineWidth = 2 / s
        c.beginPath(); c.ellipse(0, 0, 53, 9, 0, 0, TAU); c.stroke()
      }
      c.restore()
    }
    c.restore()
  }

  function draw(t: number) {
    const c = ctx!
    const small = W < 760
    const bg = c.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#0E0D12'); bg.addColorStop(1, '#17141F')
    c.fillStyle = bg; c.fillRect(0, 0, W, H)
    const mx = small ? W * 0.66 : W * 0.72
    const my = small ? H * 0.6 : H * 0.32
    const mr = Math.min(W, H) * (small ? 0.2 : 0.17)
    const halo = c.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 3)
    halo.addColorStop(0, 'rgba(169,214,229,.16)'); halo.addColorStop(1, 'rgba(169,214,229,0)')
    c.fillStyle = halo; c.fillRect(0, 0, W, H)
    const moon = c.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr)
    moon.addColorStop(0, '#E6EEF0'); moon.addColorStop(1, '#9FBCC6')
    c.fillStyle = moon; c.beginPath(); c.arc(mx, my, mr, 0, TAU); c.fill()
    ridges.forEach(r => {
      c.fillStyle = r.c
      c.beginPath(); c.moveTo(-20, H)
      r.pts.forEach(p => c.lineTo(p[0], p[1]))
      c.lineTo(W + 40, H); c.closePath(); c.fill()
    })
    const s = (small ? H * 0.36 : H * 0.6) / 400
    const hx = mx - (small ? 0 : mr * 0.2)
    const hy = H * (small ? 0.97 : 0.95)
    hatBox = { x: hx, y: hy - 352 * s, rx: Math.max(60 * s, 26), ry: Math.max(40 * s, 22) }
    skyS = s
    hunter(hx, hy, s, t)
    fog.forEach(f => {
      f.x += f.v
      if (f.x - f.r > W) f.x = -f.r
      const dx = f.x - pt.x, dy = f.y - pt.y, d = Math.sqrt(dx * dx + dy * dy)
      const push = d < 220 ? (220 - d) / 220 : 0
      const g = c.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r)
      g.addColorStop(0, `rgba(169,214,229,${0.07 * (1 - push * 0.8)})`); g.addColorStop(1, 'rgba(169,214,229,0)')
      c.fillStyle = g; c.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2)
    })
    if (reduce) return
    embers.forEach(e => {
      const dx = e.x - pt.x, dy = e.y - pt.y, d2 = dx * dx + dy * dy
      if (d2 < 14400) {
        const d = Math.sqrt(d2) || 1, f = ((120 - d) / 120) * 0.6
        e.vx += (dx / d) * f; e.vy += (dy / d) * f
      }
      e.vx *= 0.94; e.vy = e.vy * 0.94 + -0.35 * 0.06
      e.x += e.vx + Math.sin(t + e.p) * 0.2; e.y += e.vy
      if (e.y < -10) { e.y = H + 10; e.x = rnd(0, W) }
      if (e.x < -10) e.x = W + 10
      if (e.x > W + 10) e.x = -10
      const a = 0.45 + 0.35 * Math.sin(t * 1.5 + e.p)
      c.fillStyle = `rgba(227,193,122,${a.toFixed(2)})`
      c.beginPath(); c.arc(e.x, e.y, e.r, 0, TAU); c.fill()
    })
  }

  const now = () => (performance.now() - t0) / 1000

  function loop(ts: number) {
    raf = 0
    if (runtime.get().paused || !visible || document.hidden) return
    draw((ts - t0) / 1000)
    propsStep()
    propsDraw()
    raf = requestAnimationFrame(loop)
  }
  function kick() {
    if (!raf && !reduce && !runtime.get().paused && visible) raf = requestAnimationFrame(loop)
  }

  // ---------- Chapéu e lanterna ----------
  const zone = { l: 0, t: 0, r: 0, b: 0 }
  let hatFree = false
  let hatBack = false
  const hat = { x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, rest: 0 }
  const ROPE_N = 8
  let rope: RopeNode[] = []
  let segL = 20
  let grabbed: Grab = null
  const gp = { x: 0, y: 0, vx: 0, vy: 0, t: 0, sx: 0, sy: 0 }

  function propsBuild() {
    if (!pctx) return
    const r = title.getBoundingClientRect()
    props.width = Math.round(r.width * DPR)
    props.height = Math.round(r.height * DPR)
    pctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    let right = 0
    let bottom = 0
    Array.from(hud.children).forEach(el => {
      const b = el.getBoundingClientRect()
      if (!b.height) return
      right = Math.max(right, b.right - r.left)
      bottom = Math.max(bottom, b.bottom - r.top)
    })
    if (r.width >= 760) Object.assign(zone, { l: right + 24, t: 0, r: r.width, b: r.height - 4 })
    else Object.assign(zone, { l: 0, t: bottom + 16, r: r.width, b: r.height - 4 })
    const ax = r.width >= 760 ? zone.l + 70 : r.width * 0.16
    const ay = zone.t
    segL = r.width >= 760 ? 24 : 15
    rope = []
    for (let i = 0; i < ROPE_N; i++) rope.push({ x: ax, y: ay + i * segL, ox: ax, oy: ay + i * segL })
    hatFree = false
    hatBack = false
  }

  function clampZ(p: Point, m: number) {
    p.x = Math.max(zone.l + m, Math.min(zone.r - m, p.x))
    p.y = Math.max(zone.t + m, Math.min(zone.b - m, p.y))
  }

  function propsStep() {
    if (!rope.length) return
    for (let i = 1; i < rope.length; i++) {
      const p = rope[i]
      const vx = (p.x - p.ox) * 0.99, vy = (p.y - p.oy) * 0.99
      p.ox = p.x; p.oy = p.y
      p.x += vx; p.y += vy + 0.45
    }
    const L = rope[rope.length - 1]
    const holdLamp = () => {
      if (grabbed !== 'lamp') return
      L.x = gp.x; L.y = gp.y
      clampZ(L, 10)
    }
    holdLamp()
    for (let k = 0; k < 8; k++) {
      rope[0].x = rope[0].ox; rope[0].y = rope[0].oy
      for (let j = 0; j < rope.length - 1; j++) {
        const a = rope[j], b = rope[j + 1]
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, df = (d - segL) / d
        if (j === 0) { b.x -= dx * df; b.y -= dy * df }
        else { a.x += dx * df * 0.5; a.y += dy * df * 0.5; b.x -= dx * df * 0.5; b.y -= dy * df * 0.5 }
      }
      holdLamp()
    }
    for (let q = 1; q < rope.length; q++) clampZ(rope[q], 6)
    if (!hatFree || !hatBox) return
    const s = skyS
    if (grabbed === 'hat') {
      hat.vx = (gp.x - hat.x) * 0.5; hat.vy = (gp.y - hat.y) * 0.5
      hat.x += hat.vx; hat.y += hat.vy
      hat.va *= 0.8; hat.a += hat.va
    } else if (hatBack) {
      const hx = hatBox.x, hy = hatBox.y + 18 * s
      hat.x += (hx - hat.x) * 0.14; hat.y += (hy - hat.y) * 0.14; hat.a += (-0.06 - hat.a) * 0.18
      if (Math.abs(hx - hat.x) < 1.5 && Math.abs(hy - hat.y) < 1.5) { hatFree = false; hatBack = false }
    } else {
      hat.vy += 0.55; hat.x += hat.vx; hat.y += hat.vy; hat.a += hat.va
      const w = 50 * s, floor = zone.b - 7 * s
      if (hat.y > floor) {
        hat.y = floor; hat.vy *= -0.55; hat.vx *= 0.86; hat.va = hat.vx * 0.04
        if (Math.abs(hat.vy) < 1.2) hat.vy = 0
        hat.a *= 0.7
      }
      if (hat.x < zone.l + w) { hat.x = zone.l + w; hat.vx = Math.abs(hat.vx) * 0.6; hat.va = -hat.va }
      if (hat.x > zone.r - w) { hat.x = zone.r - w; hat.vx = -Math.abs(hat.vx) * 0.6; hat.va = -hat.va }
      if (hat.y < zone.t + 42 * s) { hat.y = zone.t + 42 * s; hat.vy = Math.abs(hat.vy) * 0.5 }
      // Parado no chão por uns 3,5 s, o chapéu volta sozinho para a cabeça do caçador.
      if (hat.vy === 0 && Math.abs(hat.vx) < 0.3) { hat.rest++; if (hat.rest > 210) hatBack = true }
      else hat.rest = 0
    }
  }

  function drawHat(c: CanvasRenderingContext2D, s: number, glow: number) {
    c.fillStyle = '#050407'
    c.beginPath(); c.moveTo(-20, 0); c.quadraticCurveTo(-22, -38, 0, -42); c.quadraticCurveTo(22, -38, 20, 0); c.closePath(); c.fill()
    c.beginPath(); c.ellipse(0, 0, 50, 7, 0, 0, TAU); c.fill()
    c.strokeStyle = `rgba(227,193,122,${glow})`; c.lineWidth = 2 / s
    c.beginPath(); c.ellipse(0, 0, 52, 8.5, 0, 0, TAU); c.stroke()
  }

  function propsDraw() {
    if (!pctx) return
    const c = pctx
    c.clearRect(0, 0, props.width, props.height)
    c.save()
    c.beginPath(); c.rect(zone.l, zone.t, zone.r - zone.l, zone.b - zone.t); c.clip()
    if (rope.length) {
      const L = rope[rope.length - 1], P = rope[rope.length - 2]
      const ang = Math.atan2(L.y - P.y, L.x - P.x)
      c.save()
      c.globalCompositeOperation = 'lighter'
      const beam = c.createRadialGradient(L.x, L.y, 4, L.x, L.y, 260)
      beam.addColorStop(0, 'rgba(227,193,122,.22)'); beam.addColorStop(1, 'rgba(227,193,122,0)')
      c.fillStyle = beam; c.beginPath(); c.moveTo(L.x, L.y); c.arc(L.x, L.y, 260, ang - 0.38, ang + 0.38); c.closePath(); c.fill()
      const glow = c.createRadialGradient(L.x, L.y, 2, L.x, L.y, 46)
      glow.addColorStop(0, 'rgba(227,193,122,.45)'); glow.addColorStop(1, 'rgba(227,193,122,0)')
      c.fillStyle = glow; c.beginPath(); c.arc(L.x, L.y, 46, 0, TAU); c.fill()
      c.restore()
      c.strokeStyle = '#4A4458'; c.lineWidth = 2
      c.beginPath(); c.moveTo(rope[0].x, rope[0].y)
      for (let i = 1; i < rope.length; i++) c.lineTo(rope[i].x, rope[i].y)
      c.stroke()
      c.save()
      c.translate(L.x, L.y); c.rotate(ang - Math.PI / 2)
      c.fillStyle = '#050407'; c.fillRect(-10, -2, 20, 4); c.fillRect(-9, 22, 18, 4)
      c.fillStyle = '#E3C17A'; c.fillRect(-7, 2, 14, 20)
      c.strokeStyle = '#050407'; c.lineWidth = 2; c.strokeRect(-7, 2, 14, 20)
      c.beginPath(); c.moveTo(0, 2); c.lineTo(0, 22); c.stroke()
      c.restore()
    }
    if (hatFree) {
      c.save()
      c.translate(hat.x, hat.y); c.rotate(hat.a); c.scale(skyS, skyS)
      drawHat(c, skyS, grabbed === 'hat' ? 0.9 : 0.5)
      c.restore()
    }
    c.restore()
  }

  function local(e: { clientX: number; clientY: number }): Point {
    const r = title.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  function hitProp(p: Point): Grab {
    if (reduce || !pctx || !rope.length) return null
    const L = rope[rope.length - 1]
    const dx = p.x - L.x, dy = p.y - L.y
    if (dx * dx + dy * dy < 34 * 34) return 'lamp'
    if (hatFree) {
      const ex = (p.x - hat.x) / (50 * skyS + 12), ey = (p.y - hat.y + 16 * skyS) / (30 * skyS + 12)
      if (ex * ex + ey * ey <= 1) return 'hat'
    } else if (hatBox) {
      const fx = (p.x - hatBox.x) / hatBox.rx, fy = (p.y - hatBox.y) / hatBox.ry
      if (fx * fx + fy * fy <= 1) return 'hat'
    }
    return null
  }

  function freeHat() {
    if (hatFree || !hatBox) return
    hatFree = true; hatBack = false
    hat.x = hatBox.x; hat.y = hatBox.y + 18 * skyS; hat.a = -0.06
    hat.vx = hat.vy = hat.va = 0; hat.rest = 0
  }

  function throwHat() {
    if (reduce || !pctx || !hatBox) return false
    freeHat()
    hatBack = false
    hat.vx = (zone.r - zone.l > 300 ? (Math.random() < 0.5 ? -1 : 1) : 1) * rnd(6, 13)
    hat.vy = -rnd(12, 17)
    hat.va = rnd(-0.3, 0.3)
    onHatNote()
    kick()
    return true
  }

  // Sem animação (movimento reduzido ou pausa), o chapéu só se ergue num quadro e volta.
  function tipHat() {
    if (throwHat()) return
    hatT0 = now()
    if (!raf) {
      forceLift = 1
      draw(hatT0)
      timers.push(
        window.setTimeout(() => {
          forceLift = null
          draw(now())
        }, 1600)
      )
    }
    onHatNote()
  }

  function swingLamp() {
    if (reduce || !rope.length) return
    const L = rope[rope.length - 1]
    L.ox = L.x + (Math.random() < 0.5 ? -1 : 1) * 22
    kick()
  }

  // ---------- Ponteiro ----------
  function track(e: PointerEvent) {
    const p = local(e), ts = performance.now(), dt = Math.max(8, ts - gp.t)
    gp.vx = gp.vx * 0.4 + ((p.x - gp.x) / dt) * 16 * 0.6
    gp.vy = gp.vy * 0.4 + ((p.y - gp.y) / dt) * 16 * 0.6
    gp.x = p.x; gp.y = p.y; gp.t = ts
    return p
  }
  const onControl = (e: Event) => !!(e.target as Element | null)?.closest('a,button')

  function onPointerMove(e: PointerEvent) {
    const p = track(e)
    pt.x = p.x; pt.y = p.y
    if (grabbed) return
    title.classList.toggle('grab', !onControl(e) && !!hitProp(p))
  }
  function onPointerLeave() {
    if (grabbed) return
    pt.x = pt.y = -999
    title.classList.remove('grab')
  }
  // Sem isso, no toque a página rola em vez de pegar o chapéu.
  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0]
    if (!t || onControl(e)) return
    if (hitProp(local(t))) e.preventDefault()
  }
  function onPointerDown(e: PointerEvent) {
    if (onControl(e)) return
    const p = local(e)
    gp.x = gp.sx = p.x; gp.y = gp.sy = p.y; gp.vx = gp.vy = 0; gp.t = performance.now()
    const h = hitProp(p)
    if (h) {
      e.preventDefault()
      grabbed = h
      title.classList.remove('grab')
      title.classList.add('grabbing')
      try { title.setPointerCapture(e.pointerId) } catch { /* sem captura, segue igual */ }
      if (h === 'hat') { freeHat(); hatBack = false }
      kick()
      return
    }
    if (reduce) return
    for (let i = 0; i < 14; i++) embers.push({ x: p.x, y: p.y, vx: rnd(-3, 3), vy: rnd(-3, 1), r: rnd(0.8, 2), p: rnd(0, 6.28) })
    if (embers.length > 140) embers.splice(0, embers.length - 140)
  }
  function release() {
    if (!grabbed) return
    const moved = Math.abs(gp.x - gp.sx) + Math.abs(gp.y - gp.sy)
    if (grabbed === 'hat') {
      hat.vx = Math.max(-38, Math.min(38, gp.vx)); hat.vy = Math.max(-38, Math.min(38, gp.vy)); hat.va = hat.vx * 0.03
      if (moved > 30 || Math.abs(hat.vx) + Math.abs(hat.vy) > 6) onHatNote()
    } else {
      const L = rope[rope.length - 1]
      L.ox = L.x - Math.max(-30, Math.min(30, gp.vx))
      L.oy = L.y - Math.max(-30, Math.min(30, gp.vy))
    }
    grabbed = null
    title.classList.remove('grabbing')
  }

  // ---------- Montagem ----------
  build()
  propsBuild()
  draw(0)
  propsDraw()

  let resizeT = 0
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeT)
    resizeT = window.setTimeout(() => {
      build()
      propsBuild()
      draw(now())
      propsDraw()
    }, 120)
  })
  ro.observe(title)

  title.addEventListener('pointermove', onPointerMove)
  title.addEventListener('pointerleave', onPointerLeave)
  title.addEventListener('touchstart', onTouchStart, { passive: false })
  title.addEventListener('pointerdown', onPointerDown)
  title.addEventListener('pointerup', release)
  title.addEventListener('pointercancel', release)

  let io: IntersectionObserver | null = null
  const unsubscribe = runtime.subscribe(kick)
  if (!reduce) {
    io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      kick()
    })
    io.observe(title)
    document.addEventListener('visibilitychange', kick)
    kick()
  }

  return {
    throwHat() {
      if (!throwHat()) tipHat()
    },
    swingLamp,
    tipHat,
    destroy() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      window.clearTimeout(resizeT)
      timers.forEach(t => window.clearTimeout(t))
      ro.disconnect()
      io?.disconnect()
      unsubscribe()
      document.removeEventListener('visibilitychange', kick)
      title.removeEventListener('pointermove', onPointerMove)
      title.removeEventListener('pointerleave', onPointerLeave)
      title.removeEventListener('touchstart', onTouchStart)
      title.removeEventListener('pointerdown', onPointerDown)
      title.removeEventListener('pointerup', release)
      title.removeEventListener('pointercancel', release)
    },
  }
}
