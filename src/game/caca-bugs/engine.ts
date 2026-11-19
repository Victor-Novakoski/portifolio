import { prefersReducedMotion, rnd } from '@/lib/motion'
import { PERKS, WAVE_MS, WAVES, type PerkId } from '@/game/caca-bugs/tree'

// Caça-bugs: proteger a Produção por 3 ondas de 40 s. Golpear, agarrar e arremessar bugs; as relíquias do Sobre
// (rosa de ferro, amigurumi, bazuca) aparecem como poderes. Cada bug caçado vale 1 fragmento, gasto na árvore
// de habilidades entre as ondas (decisão 015). Portado do protótipo "Forja do Caçador".

type BugType = 'n' | 's' | 'a' // normal, duplicado (se divide), pede confirmação
type Bug = { x: number; y: number; vx: number; vy: number; r: number; type: BugType; ack: number; thrown: number; w: number }
type RelicKind = 'rosa' | 'ami' | 'baz'
type Relic = { k: RelicKind; x: number; y: number; l: number; p: number }
type Ball = { x: number; y: number; vx: number; vy: number; r: number; l: number; a: number }
type Effect =
  | { k: 't'; x: number; y: number; s: string; c: string; l: number }
  | { k: 's' | 'r'; x: number; y: number; l: number }
  | { k: 'z'; x: number; y: number; tx: number; ty: number; l: number }
// Caçador automático (Goroutine): gira em volta da Produção e golpeia sozinho.
type Hunter = { a: number; cd: number }
type Particle = { x: number; y: number; vx: number; vy: number; c: string; l: number; s: number }
type Held = Bug | Ball

type Game = {
  t: number
  score: number
  core: { x: number; y: number; r: number; hp: number; shield: number }
  bugs: Bug[]
  relics: Relic[]
  balls: Ball[]
  fx: Effect[]
  parts: Particle[]
  combo: number
  comboT: number
  spawnT: number
  relicT: number
  relicI: number
  baz: number
  over: boolean
  paused: boolean
  shake: number
  aim: { x: number; y: number; vx: number; vy: number; px: number; py: number }
  held: Held | null
  kills: number
  wave: number
  frag: number
  perks: Set<PerkId>
  rollback: boolean
  hunters: Hunter[]
  shop: boolean
  // Próximo bug já sorteado (Suspense mostra de onde ele vem).
  next: Spawn | null
  vacT: number
  mqT: number
}
type Spawn = { x: number; y: number; type: BugType }

// `endless`: segundos sobrevividos na onda 3, que não tem fim.
export type Result = { score: number; kills: number; record: boolean; best: number; wave: number; perks: PerkId[]; seconds: number; endless: number }
export type Shop = { wave: number; frag: number; perks: PerkId[] }

export type EngineEvents = {
  // Na onda sem fim, `time` é o tempo sobrevivido; antes, o que falta da onda.
  hud(h: { score: number; time: number; endless: boolean; core: number; relic: string; wave: number; frag: number }): void
  say(text: string): void
  paused(score: number): void
  over(result: Result): void
  // Fim de uma onda que não é a última: o jogo para e a árvore abre.
  shop(shop: Shop): void
}

export type Engine = {
  start(): void
  pause(paused: boolean): void
  togglePause(): void
  buy(id: PerkId): Shop | null
  nextWave(): void
  destroy(): void
}

const RELIC: Record<RelicKind, string> = { rosa: 'Rosa de ferro', ami: 'Amigurumi', baz: 'Bazuca' }
export const CORE_HP = 6
const SLASH_R = 40
const LIGHT_R = 95
const HUNTER_MS = 2000
const VACUUM_MS = 8000
const MQ_MS = 8000
const SUSPENSE_MS = 1000
// Escala da dificuldade nas ondas com tempo. A última onda não tem fim (decisão 015): continua até a Produção cair.
const DUR = WAVES * WAVE_MS
const ENDLESS_AT = (WAVES - 1) * WAVE_MS
// Segundos dentro da onda sem fim (0 antes dela). A dificuldade sobe com isso até a build cheia não dar conta.
const endlessS = (g: { t: number }) => Math.max(0, g.t - ENDLESS_AT) / 1000
const TAU = Math.PI * 2
const MOVE_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'])

export function mountEngine(canvas: HTMLCanvasElement, best: number, on: EngineEvents): Engine {
  const reduce = prefersReducedMotion()
  const mc = canvas.getContext('2d')!
  let raf = 0
  let last = 0
  let MW = 0
  let MH = 0
  let DPR = 1
  let G: Game | null = null
  let hudT = 0
  let record = best
  let started = false
  const keys: Record<string, boolean> = {}
  let down: { x: number; y: number; t: number; b: Held | null; last: number } | null = null

  function resize() {
    const r = canvas.getBoundingClientRect()
    DPR = Math.min(window.devicePixelRatio || 1, 2)
    MW = Math.max(200, r.width)
    MH = Math.max(200, r.height)
    canvas.width = Math.round(MW * DPR)
    canvas.height = Math.round(MH * DPR)
    mc.setTransform(DPR, 0, 0, DPR, 0, 0)
    if (G) {
      G.core.x = MW / 2
      G.core.y = MH / 2
    }
  }

  function newGame(): Game {
    return {
      t: 0, score: 0,
      core: { x: MW / 2, y: MH / 2, r: 30, hp: CORE_HP, shield: 0 },
      bugs: [], relics: [], balls: [], fx: [], parts: [],
      combo: 0, comboT: 0, spawnT: 600, relicT: 8000, relicI: 0, baz: 0,
      over: false, paused: true, shake: 0,
      aim: { x: MW / 2, y: MH * 0.25, vx: 0, vy: 0, px: MW / 2, py: MH * 0.25 },
      held: null, kills: 0,
      wave: 1, frag: 0, perks: new Set(), rollback: false, hunters: [], shop: false,
      next: null, vacT: VACUUM_MS, mqT: 0,
    }
  }

  const running = () => !!G && !G.over && !G.paused

  // Efeitos dos nós da árvore.
  const slashR = (g: Game) => (g.perks.has('batching') ? SLASH_R * 1.5 : SLASH_R)
  const lightR = (g: Game) => (g.perks.has('indice') ? LIGHT_R * 1.5 : LIGHT_R)
  const shopState = (g: Game) => ({ wave: g.wave, frag: g.frag, perks: [...g.perks] })

  function hunterAt(g: Game, h: Hunter) {
    return { x: g.core.x + Math.cos(h.a) * (g.core.r + 26), y: g.core.y + Math.sin(h.a) * (g.core.r + 26) }
  }

  function rollSpawn(g: Game): Spawn {
    const edge = Math.floor(Math.random() * 4)
    const t = g.t / 1000
    const roll = Math.random()
    let x: number
    let y: number
    if (edge === 0) { x = rnd(0, MW); y = -20 }
    else if (edge === 1) { x = MW + 20; y = rnd(0, MH) }
    else if (edge === 2) { x = rnd(0, MW); y = MH + 20 }
    else { x = -20; y = rnd(0, MH) }
    const e = endlessS(g)
    const sCap = Math.min(0.35, 0.3 + e / 600), aCap = Math.min(0.75, 0.5 + e / 240)
    const type: BugType = roll < Math.min(sCap, 0.1 + t / 250) ? 's' : roll < Math.min(aCap, 0.2 + t / 200) ? 'a' : 'n'
    return { x, y, type }
  }

  function spawnEnemy(g: Game) {
    const { x, y, type } = g.next ?? rollSpawn(g)
    g.next = rollSpawn(g)
    g.bugs.push({ x, y, vx: 0, vy: 0, r: type === 's' ? 22 : 15, type, ack: 0, thrown: 0, w: rnd(0, 6) })
  }

  const text = (g: Game, x: number, y: number, s: string, c = '#F0B44C') => g.fx.push({ k: 't', x, y, s, c, l: 50 })
  function burst(g: Game, x: number, y: number, c: string, n: number) {
    for (let i = 0; i < n; i++) g.parts.push({ x, y, vx: rnd(-5, 5), vy: rnd(-8, -2), c, l: rnd(40, 70), s: rnd(2, 5) })
  }
  const remove = <T,>(list: T[], item: T) => {
    const i = list.indexOf(item)
    if (i > -1) list.splice(i, 1)
    return i > -1
  }

  function kill(g: Game, b: Bug, base = 10, how = '') {
    if (!remove(g.bugs, b)) return
    if (g.held === b) g.held = null
    g.combo = g.comboT > 0 ? g.combo + 1 : 1
    g.comboT = g.perks.has('redis') ? 3000 : 1500
    const pts = base * Math.min(g.combo, 5)
    g.score += pts
    g.kills++
    g.frag++
    text(g, b.x, b.y - 10, `${how ? `${how} ` : ''}+${pts}${g.combo > 1 ? ` x${Math.min(g.combo, 5)}` : ''}`)
    burst(g, b.x, b.y, b.type === 'a' ? '#A9D6E5' : b.type === 's' ? '#9C978E' : '#E0505C', 8)
  }

  function hit(g: Game, b: Bug) {
    // Duplicado se divide como O Desincronizado; o pálido pede confirmação como O Mensageiro.
    if (b.type === 's' && b.r >= 18) {
      remove(g.bugs, b)
      if (g.held === b) g.held = null
      g.score += 5
      text(g, b.x, b.y - 12, 'DIVIDIU', '#9C978E')
      for (let k = -1; k <= 1; k += 2) g.bugs.push({ x: b.x + k * 8, y: b.y, vx: k * 7, vy: rnd(-3, 3), r: 13, type: 'n', ack: 0, thrown: 0, w: 0 })
      return
    }
    if (b.type === 'a') {
      if (b.ack > 0 || g.perks.has('typescript')) kill(g, b, 20, 'ACK')
      else {
        b.ack = 800
        text(g, b.x, b.y - 12, 'CONFIRME', '#A9D6E5')
      }
      return
    }
    kill(g, b)
  }

  function slash(g: Game, x: number, y: number) {
    g.fx.push({ k: 's', x, y, l: 14 })
    if (g.baz) {
      g.baz = 0
      g.fx.push({ k: 'r', x, y, l: 30 })
      if (!reduce) g.shake = 10
      on.say('Bazuca!')
      g.bugs.slice().forEach(b => {
        const dx = b.x - x, dy = b.y - y, d = Math.sqrt(dx * dx + dy * dy) || 1
        if (d < 130) kill(g, b, 15, 'BUM')
        else if (d < 260) { b.vx += (dx / d) * 14; b.vy += (dy / d) * 14 }
      })
      return
    }
    let any = false
    g.bugs.slice().forEach(b => {
      const dx = b.x - x, dy = b.y - y
      const R = b.r + slashR(g)
      if (dx * dx + dy * dy < R * R) { hit(g, b); any = true }
    })
    if (!any) g.relics.slice().forEach(r => {
      const dx = r.x - x, dy = r.y - y
      if (dx * dx + dy * dy < 40 * 40) take(g, r)
    })
  }

  function take(g: Game, r: Relic) {
    remove(g.relics, r)
    if (r.k === 'rosa') { g.core.shield = 8000; on.say('Rosa de ferro: a Produção está protegida.') }
    else if (r.k === 'ami') { g.balls.push({ x: r.x, y: r.y, vx: rnd(-9, 9), vy: -10, r: 16, l: 11000, a: 0 }); on.say('Amigurumi: arremesse a bola contra os bugs.') }
    else { g.baz = 1; on.say('Bazuca carregada: o próximo golpe explode.') }
    text(g, r.x, r.y - 20, RELIC[r.k].toUpperCase(), '#A9D6E5')
  }

  function grabAt(g: Game, x: number, y: number) {
    let best: Held | null = null
    let bd = 1e9
    ;[...g.bugs, ...g.balls].forEach(b => {
      const dx = b.x - x, dy = b.y - y, d = dx * dx + dy * dy
      if (d < (b.r + 18) * (b.r + 18) && d < bd) { bd = d; best = b }
    })
    return best as Held | null
  }

  function throwHeld(g: Game) {
    const b = g.held
    if (!b) return
    g.held = null
    b.vx = Math.max(-34, Math.min(34, g.aim.vx))
    b.vy = Math.max(-34, Math.min(34, g.aim.vy))
    if ('thrown' in b && Math.abs(b.vx) + Math.abs(b.vy) > 7) b.thrown = 70
  }

  function end(g: Game) {
    g.over = true
    g.held = null
    const isRecord = g.score > record
    if (isRecord) record = g.score
    on.say(`Fim da caçada. ${g.score} pontos.`)
    pushHud(g)
    on.over({
      score: g.score, kills: g.kills, record: isRecord, best: record,
      wave: g.wave, perks: [...g.perks], seconds: Math.round(g.t / 1000), endless: Math.floor(endlessS(g)),
    })
  }

  function update(g: Game, dt: number) {
    const f = dt / 16.67
    const c = g.core
    g.t += dt
    if (g.wave < WAVES && g.t >= g.wave * WAVE_MS) {
      g.t = g.wave * WAVE_MS
      return endWave(g)
    }
    const a = g.aim
    if (keys.ArrowLeft || keys.a) a.x -= 7 * f
    if (keys.ArrowRight || keys.d) a.x += 7 * f
    if (keys.ArrowUp || keys.w) a.y -= 7 * f
    if (keys.ArrowDown || keys.s) a.y += 7 * f
    a.x = Math.max(0, Math.min(MW, a.x))
    a.y = Math.max(0, Math.min(MH, a.y))
    if ([...MOVE_KEYS].some(k => keys[k])) {
      a.vx = (a.x - a.px) / f
      a.vy = (a.y - a.py) / f
    }
    a.px = a.x
    a.py = a.y
    g.spawnT -= dt
    if (g.spawnT <= 0) {
      spawnEnemy(g)
      const e = endlessS(g)
      if (g.t > WAVE_MS && Math.random() < Math.min(0.9, 0.4 + e / 300)) spawnEnemy(g)
      g.spawnT = e > 0 ? Math.max(170, 660 * Math.pow(0.99, e)) : Math.max(360, 1250 - (g.t / DUR) * 880)
    }
    g.relicT -= dt
    if (g.relicT <= 0) {
      const kinds: RelicKind[] = ['rosa', 'ami', 'baz']
      g.relics.push({ k: kinds[g.relicI++ % 3], x: rnd(60, MW - 60), y: rnd(60, MH - 60), l: 9000, p: 0 })
      g.relicT = rnd(11000, 15000)
    }
    if (g.comboT > 0) g.comboT -= dt
    if (c.shield > 0) c.shield -= dt
    const spd = 1.6 + (g.t / DUR) * 2.2 + endlessS(g) * 0.008
    const LR = lightR(g), slow = g.perks.has('indice') ? 0.3 : 0.45
    if (g.mqT > 0) g.mqT -= dt
    if (g.perks.has('vacuum')) {
      g.vacT -= dt
      if (g.vacT <= 0) {
        g.vacT = VACUUM_MS
        const pale = g.bugs.filter(b => b.type === 'a')
        pale.forEach(b => kill(g, b, 10, 'VACUUM'))
        if (pale.length) on.say(`Vacuum limpou ${pale.length} bugs pálidos.`)
      }
    }
    for (const h of g.hunters) {
      if (!reduce) h.a += 0.02 * f
      h.cd -= dt
      if (h.cd > 0 || !g.bugs.length) continue
      // Golpeia o bug mais perto da Produção.
      let target = g.bugs[0], bd = 1e9
      for (const b of g.bugs) {
        const d = (b.x - c.x) ** 2 + (b.y - c.y) ** 2
        if (d < bd && g.held !== b) { bd = d; target = b }
      }
      if (g.held === target) continue
      h.cd = HUNTER_MS
      const p = hunterAt(g, h)
      g.fx.push({ k: 'z', x: p.x, y: p.y, tx: target.x, ty: target.y, l: 12 })
      hit(g, target)
      if (g.perks.has('channels')) {
        // Channels: o golpe passa adiante para o bug mais perto do primeiro.
        let near: Bug | null = null, nd = 160 * 160
        for (const b of g.bugs) {
          const d = (b.x - target.x) ** 2 + (b.y - target.y) ** 2
          if (b !== target && g.held !== b && d < nd) { nd = d; near = b }
        }
        if (near) {
          g.fx.push({ k: 'z', x: target.x, y: target.y, tx: near.x, ty: near.y, l: 12 })
          hit(g, near)
        }
      }
    }
    for (const b of g.bugs.slice()) {
      b.w += 0.2 * f
      if (b.ack > 0) {
        b.ack -= dt
        if (b.ack <= 0) text(g, b.x, b.y - 12, 'SEM ACK', '#9C978E')
      }
      if (g.held === b) {
        b.vx = (a.x - b.x) * 0.4
        b.vy = (a.y - b.y) * 0.4
      } else {
        const dx = c.x - b.x, dy = c.y - b.y, d = Math.sqrt(dx * dx + dy * dy) || 1
        if (b.thrown <= 0) {
          b.vx += ((dx / d) * 0.09 + Math.cos(b.w) * 0.05) * f
          b.vy += ((dy / d) * 0.09 + Math.sin(b.w) * 0.05) * f
        }
        // A luz da lanterna (a mira) deixa os bugs lentos.
        const lx = a.x - b.x, ly = a.y - b.y, lit = lx * lx + ly * ly < LR * LR
        const cap = lit ? spd * slow : spd, sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
        if (b.thrown > 0) b.thrown -= f
        else if (sp > cap) { b.vx *= cap / sp; b.vy *= cap / sp }
        if (d < c.r + b.r) {
          if (c.shield > 0) {
            b.vx = (-dx / d) * 9; b.vy = (-dy / d) * 9
            b.x = c.x - (dx / d) * (c.r + b.r + 1); b.y = c.y - (dy / d) * (c.r + b.r + 1)
          } else if (g.perks.has('rabbitmq') && g.mqT <= 0) {
            // RabbitMQ: o bug volta para a borda em vez de acertar a Produção.
            g.mqT = MQ_MS
            const back = rollSpawn(g)
            b.x = back.x; b.y = back.y; b.vx = 0; b.vy = 0
            text(g, c.x, c.y - 44, 'DE VOLTA À FILA', '#A9D6E5')
          } else {
            remove(g.bugs, b)
            c.hp--
            if (c.hp <= 0 && g.perks.has('transacao') && !g.rollback) {
              // Transação: o golpe fatal é desfeito uma vez.
              g.rollback = true
              c.hp = 2
              text(g, c.x, c.y - 44, 'ROLLBACK', '#A9D6E5')
              on.say('Transação: o golpe foi desfeito. A Produção volta com 2 de vida.')
              return
            }
            burst(g, c.x, c.y, '#E0505C', 10)
            if (!reduce) g.shake = 8
            text(g, c.x, c.y - 44, 'PRODUÇÃO -1', '#E0505C')
            on.say(`A Produção foi atingida. Restam ${c.hp}.`)
            if (c.hp <= 0) return end(g)
            return
          }
        }
      }
      b.x += b.vx * f
      b.y += b.vy * f
      if (b.thrown > 0 || g.held === b) {
        if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.8 }
        if (b.x > MW - b.r) { b.x = MW - b.r; b.vx = -Math.abs(b.vx) * 0.8 }
        if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.8 }
        if (b.y > MH - b.r) { b.y = MH - b.r; b.vy = -Math.abs(b.vy) * 0.8 }
      }
    }
    // Bug arremessado com força derruba o que atingir.
    for (let i = 0; i < g.bugs.length; i++) {
      for (let j = i + 1; j < g.bugs.length; j++) {
        const A = g.bugs[i], B = g.bugs[j]
        const dx = B.x - A.x, dy = B.y - A.y, d = Math.sqrt(dx * dx + dy * dy) || 1, m = A.r + B.r
        if (d >= m) continue
        const fast = (A.thrown > 0 && Math.abs(A.vx) + Math.abs(A.vy) > 6) || (B.thrown > 0 && Math.abs(B.vx) + Math.abs(B.vy) > 6)
        if (fast) {
          kill(g, A, 25, 'ARREMESSO')
          kill(g, B, 25, 'ARREMESSO')
          i = -1
          break
        }
        const nx = dx / d, ny = dy / d, o = (m - d) / 2
        A.x -= nx * o; A.y -= ny * o; B.x += nx * o; B.y += ny * o
        const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny
        if (rv < 0) { A.vx += rv * nx * 0.9; A.vy += rv * ny * 0.9; B.vx -= rv * nx * 0.9; B.vy -= rv * ny * 0.9 }
      }
    }
    for (const o of g.balls.slice()) {
      o.l -= dt
      if (o.l <= 0 && g.held !== o) { remove(g.balls, o); continue }
      if (g.held === o) { o.vx = (a.x - o.x) * 0.4; o.vy = (a.y - o.y) * 0.4 }
      else { o.vx *= 0.997; o.vy *= 0.997 }
      o.x += o.vx * f; o.y += o.vy * f; o.a += o.vx * 0.03
      if (o.x < o.r) { o.x = o.r; o.vx = Math.abs(o.vx) * 0.95 }
      if (o.x > MW - o.r) { o.x = MW - o.r; o.vx = -Math.abs(o.vx) * 0.95 }
      if (o.y < o.r) { o.y = o.r; o.vy = Math.abs(o.vy) * 0.95 }
      if (o.y > MH - o.r) { o.y = MH - o.r; o.vy = -Math.abs(o.vy) * 0.95 }
      g.bugs.slice().forEach(b => {
        const dx = b.x - o.x, dy = b.y - o.y
        if (dx * dx + dy * dy < (b.r + o.r) * (b.r + o.r) && Math.abs(o.vx) + Math.abs(o.vy) > 2) kill(g, b, 15, 'NOVELO')
      })
    }
    for (const r of g.relics.slice()) {
      r.l -= dt
      r.p += 0.05 * f
      if (r.l <= 0) { remove(g.relics, r); continue }
      const dx = r.x - a.x, dy = r.y - a.y
      if (dx * dx + dy * dy < 30 * 30) take(g, r)
    }
    g.parts.forEach(p => {
      p.vy += 0.4 * f; p.x += p.vx * f; p.y += p.vy * f
      if (p.y > MH - 4) { p.y = MH - 4; p.vy *= -0.45; p.vx *= 0.7 }
      p.l -= f
    })
    g.parts = g.parts.filter(p => p.l > 0)
    g.fx.forEach(e => {
      e.l -= f
      if (e.k === 't') e.y -= 0.7 * f
    })
    g.fx = g.fx.filter(e => e.l > 0)
    if (g.shake > 0) g.shake -= f
  }

  function endWave(g: Game) {
    g.held = null
    // A onda termina limpa: os bugs que sobraram fogem.
    g.bugs.forEach(b => burst(g, b.x, b.y, '#3D3A36', 3))
    g.bugs = []
    g.balls = []
    g.relics = []
    g.paused = true
    g.shop = true
    draw(g)
    pushHud(g)
    on.say(`Fim da onda ${g.wave}. Você tem ${g.frag} fragmentos para a árvore.`)
    on.shop(shopState(g))
  }

  function drawBug(b: Bug) {
    const c = mc
    const legs = Math.sin(b.w * 3) * 3
    c.save()
    c.translate(b.x, b.y)
    c.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2)
    if (b.type === 's') {
      c.globalAlpha = 0.3; c.fillStyle = '#9C978E'
      c.beginPath(); c.ellipse(-7, 3, b.r * 0.7, b.r, 0, 0, TAU); c.ellipse(7, -3, b.r * 0.7, b.r, 0, 0, TAU); c.fill()
      c.globalAlpha = 1
    }
    c.strokeStyle = '#E4E0D8'; c.lineWidth = 1.5
    for (let k = -1; k <= 1; k++) {
      c.beginPath()
      c.moveTo(-b.r * 0.6, k * b.r * 0.45); c.lineTo(-b.r * 1.15, k * b.r * 0.55 + legs * k)
      c.moveTo(b.r * 0.6, k * b.r * 0.45); c.lineTo(b.r * 1.15, k * b.r * 0.55 - legs * k)
      c.stroke()
    }
    c.globalAlpha = b.type === 'a' ? (b.ack > 0 ? 1 : 0.6) : 1
    c.fillStyle = b.type === 'a' ? '#A9D6E5' : b.type === 's' ? '#6B6760' : '#E0505C'
    c.beginPath(); c.ellipse(0, 2, b.r * 0.65, b.r * 0.9, 0, 0, TAU); c.fill()
    c.fillStyle = '#E4E0D8'; c.beginPath(); c.arc(0, -b.r * 0.8, b.r * 0.35, 0, TAU); c.fill()
    c.globalAlpha = 1
    if (b.ack > 0) { c.strokeStyle = '#A9D6E5'; c.beginPath(); c.arc(0, 0, b.r + 6, 0, TAU * (b.ack / 800)); c.stroke() }
    c.restore()
  }

  function drawRelic(r: Relic) {
    const c = mc
    const y = r.y + Math.sin(r.p) * 4
    c.save()
    c.translate(r.x, y)
    c.strokeStyle = 'rgba(169,214,229,.6)'; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, 24, 0, TAU); c.stroke()
    if (r.k === 'rosa') {
      c.fillStyle = '#8E8A96'
      for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(Math.cos(i * 1.256) * 6, Math.sin(i * 1.256) * 6, 7, 5, i * 1.256, 0, TAU); c.fill() }
      c.fillStyle = '#E0505C'; c.beginPath(); c.arc(0, 0, 4, 0, TAU); c.fill()
    } else if (r.k === 'ami') {
      c.fillStyle = '#F0B44C'; c.beginPath(); c.arc(0, 0, 12, 0, TAU); c.fill()
      c.strokeStyle = '#8A6E36'; c.beginPath(); c.arc(0, 0, 8, 0.3, 2.6); c.moveTo(-10, -4); c.quadraticCurveTo(0, 4, 10, -4); c.stroke()
    } else {
      c.rotate(-0.5)
      c.fillStyle = '#9C978E'; c.fillRect(-15, -5, 30, 10)
      c.fillStyle = '#3D3A36'; c.fillRect(-4, 5, 6, 8)
      c.fillStyle = '#F0B44C'; c.fillRect(13, -6, 4, 12)
    }
    c.restore()
    c.fillStyle = 'rgba(237,231,220,.85)'; c.font = '500 11px "IBM Plex Mono", monospace'; c.textAlign = 'center'
    c.fillText(RELIC[r.k], r.x, y + 40)
  }

  function drawBase() {
    const c = mc
    c.setTransform(DPR, 0, 0, DPR, 0, 0)
    const g = c.createRadialGradient(MW / 2, MH / 2, 20, MW / 2, MH / 2, Math.max(MW, MH) * 0.7)
    g.addColorStop(0, '#16131D'); g.addColorStop(1, '#08070B')
    c.fillStyle = g; c.fillRect(0, 0, MW, MH)
    c.strokeStyle = 'rgba(74,68,88,.25)'; c.lineWidth = 1
    for (let x = 0; x < MW; x += 48) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, MH); c.stroke() }
    for (let y = 0; y < MH; y += 48) { c.beginPath(); c.moveTo(0, y); c.lineTo(MW, y); c.stroke() }
    if (!G) return
    const C = G.core
    c.fillStyle = '#1A1918'; c.strokeStyle = C.hp > 2 ? '#F0B44C' : '#E0505C'; c.lineWidth = 2
    c.beginPath(); c.arc(C.x, C.y, C.r, 0, TAU); c.fill(); c.stroke()
    c.fillStyle = '#9C978E'
    for (let k = -1; k <= 1; k++) c.fillRect(C.x - 13, C.y + k * 8 - 3, 26, 5)
    c.fillStyle = '#F0B44C'
    for (let h = 0; h < CORE_HP; h++) { c.globalAlpha = h < C.hp ? 1 : 0.2; c.fillRect(C.x - CORE_HP * 5 + 1 + h * 10, C.y + C.r + 8, 8, 4) }
    c.globalAlpha = 1
    c.fillStyle = 'rgba(237,231,220,.8)'; c.font = '500 11px "IBM Plex Mono", monospace'; c.textAlign = 'center'
    c.fillText('PRODUÇÃO', C.x, C.y - C.r - 22)
    // A Produção usa o chapéu do caçador.
    c.fillStyle = '#24221F'; c.strokeStyle = '#E4E0D8'; c.lineWidth = 1
    c.beginPath(); c.ellipse(C.x, C.y - C.r + 2, 30, 5, 0, 0, TAU); c.fill(); c.stroke()
    c.fillStyle = '#2E2C29'
    c.beginPath(); c.moveTo(C.x - 14, C.y - C.r + 1); c.quadraticCurveTo(C.x - 14, C.y - C.r - 18, C.x, C.y - C.r - 19)
    c.quadraticCurveTo(C.x + 14, C.y - C.r - 18, C.x + 14, C.y - C.r + 1); c.closePath(); c.fill(); c.stroke()
    if (C.shield > 0) {
      c.strokeStyle = `rgba(169,214,229,${Math.min(1, C.shield / 1500).toFixed(2)})`; c.lineWidth = 3
      c.beginPath(); c.arc(C.x, C.y, C.r + 14, 0, TAU); c.stroke()
    }
  }

  function draw(g: Game) {
    const c = mc
    drawBase()
    if (g.shake > 0) c.translate(rnd(-1, 1) * g.shake * 0.5, rnd(-1, 1) * g.shake * 0.5)
    const A = g.aim
    const LR = lightR(g)
    const lg = c.createRadialGradient(A.x, A.y, 4, A.x, A.y, LR)
    lg.addColorStop(0, 'rgba(240,180,76,.22)'); lg.addColorStop(1, 'rgba(240,180,76,0)')
    c.fillStyle = lg; c.beginPath(); c.arc(A.x, A.y, LR, 0, TAU); c.fill()
    g.hunters.forEach(h => {
      const p = hunterAt(g, h)
      c.fillStyle = '#F0B44C'; c.beginPath(); c.arc(p.x, p.y, 5, 0, TAU); c.fill()
      c.strokeStyle = 'rgba(240,180,76,.5)'; c.lineWidth = 1
      c.beginPath(); c.arc(p.x, p.y, 9, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - Math.max(0, h.cd) / HUNTER_MS)); c.stroke()
    })
    if (g.perks.has('suspense') && g.next && g.spawnT < SUSPENSE_MS) {
      const n = g.next, mx = Math.max(22, Math.min(MW - 22, n.x)), my = Math.max(22, Math.min(MH - 22, n.y))
      c.strokeStyle = '#A9D6E5'; c.lineWidth = 2; c.setLineDash([4, 4])
      c.beginPath(); c.arc(mx, my, 14, 0, TAU); c.stroke(); c.setLineDash([])
      c.fillStyle = '#A9D6E5'; c.font = '500 11px "IBM Plex Mono", monospace'; c.textAlign = 'center'
      c.fillText('!', mx, my + 4)
    }
    g.relics.forEach(drawRelic)
    g.balls.forEach(o => {
      c.save(); c.translate(o.x, o.y); c.rotate(o.a); c.globalAlpha = o.l < 2000 ? 0.5 : 1
      c.fillStyle = '#F0B44C'; c.beginPath(); c.arc(0, 0, o.r, 0, TAU); c.fill()
      c.strokeStyle = '#8A6E36'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, o.r * 0.6, 0.2, 2.8); c.moveTo(-o.r, -3); c.quadraticCurveTo(0, 6, o.r, -3); c.stroke()
      c.restore()
    })
    g.bugs.forEach(drawBug)
    if (g.held) {
      c.strokeStyle = 'rgba(240,180,76,.6)'; c.setLineDash([4, 4])
      c.beginPath(); c.moveTo(A.x, A.y); c.lineTo(g.held.x, g.held.y); c.stroke(); c.setLineDash([])
    }
    g.parts.forEach(p => { c.globalAlpha = Math.min(1, p.l / 20); c.fillStyle = p.c; c.fillRect(p.x, p.y, p.s, p.s) })
    c.globalAlpha = 1
    g.fx.forEach(e => {
      if (e.k === 't') {
        c.globalAlpha = Math.min(1, e.l / 20); c.fillStyle = e.c; c.font = '700 16px "Cormorant SC", Georgia, serif'; c.textAlign = 'center'
        c.fillText(e.s, e.x, e.y)
      } else if (e.k === 's') {
        c.globalAlpha = e.l / 14; c.strokeStyle = '#A9C3CC'; c.lineWidth = 3
        c.beginPath(); c.arc(e.x, e.y, slashR(g) + 4 - e.l, -2.4, -0.4); c.stroke()
      } else if (e.k === 'z') {
        c.globalAlpha = e.l / 12; c.strokeStyle = '#F0B44C'; c.lineWidth = 2
        c.beginPath(); c.moveTo(e.x, e.y); c.lineTo(e.tx, e.ty); c.stroke()
      } else {
        c.globalAlpha = e.l / 30; c.strokeStyle = '#F0B44C'; c.lineWidth = 4
        c.beginPath(); c.arc(e.x, e.y, 130 - e.l * 3, 0, TAU); c.stroke()
      }
    })
    c.globalAlpha = 1
    c.strokeStyle = g.baz ? '#F0B44C' : '#E4E0D8'; c.lineWidth = 1.5
    c.beginPath(); c.arc(A.x, A.y, 12, 0, TAU)
    c.moveTo(A.x - 18, A.y); c.lineTo(A.x - 8, A.y); c.moveTo(A.x + 8, A.y); c.lineTo(A.x + 18, A.y)
    c.moveTo(A.x, A.y - 18); c.lineTo(A.x, A.y - 8); c.moveTo(A.x, A.y + 8); c.lineTo(A.x, A.y + 18)
    c.stroke()
  }

  function pushHud(g: Game) {
    on.hud({
      score: g.score,
      time: g.wave < WAVES ? Math.ceil((g.wave * WAVE_MS - g.t) / 1000) : Math.floor(endlessS(g)),
      endless: g.wave >= WAVES,
      core: g.core.hp,
      relic: g.baz ? 'bazuca pronta' : g.core.shield > 0 ? 'rosa de ferro' : g.balls.length ? 'amigurumi' : 'nenhuma',
      wave: g.wave,
      frag: g.frag,
    })
  }

  function tick(now: number) {
    raf = 0
    const g = G
    if (!g || g.paused) return
    const dt = Math.min(40, now - last)
    last = now
    if (!g.over) update(g, dt)
    draw(g)
    hudT -= dt
    if (hudT <= 0) {
      pushHud(g)
      hudT = 120
    }
    if (!g.over) raf = requestAnimationFrame(tick)
  }

  function run() {
    last = performance.now()
    if (!raf) raf = requestAnimationFrame(tick)
  }

  // ---------- Entrada ----------
  function local(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  function onPointerDown(e: PointerEvent) {
    const g = G
    if (!g || !running()) return
    e.preventDefault()
    try { canvas.setPointerCapture(e.pointerId) } catch { /* segue sem captura */ }
    const p = local(e)
    g.aim.x = g.aim.px = p.x
    g.aim.y = g.aim.py = p.y
    g.aim.vx = g.aim.vy = 0
    const b = grabAt(g, p.x, p.y)
    down = { x: p.x, y: p.y, t: performance.now(), b, last: performance.now() }
    if (b) g.held = b
    else slash(g, p.x, p.y)
  }
  function onPointerMove(e: PointerEvent) {
    const g = G
    if (!g) return
    const p = local(e), now = performance.now(), dt = Math.max(8, now - (down ? down.last : now - 16))
    g.aim.vx = g.aim.vx * 0.4 + ((p.x - g.aim.x) / dt) * 16 * 0.6
    g.aim.vy = g.aim.vy * 0.4 + ((p.y - g.aim.y) / dt) * 16 * 0.6
    g.aim.x = g.aim.px = p.x
    g.aim.y = g.aim.py = p.y
    if (down) down.last = now
  }
  function onPointerUp() {
    const g = G
    if (!g || !down) return
    const d = down
    down = null
    if (!d.b || g.held !== d.b) return
    const moved = Math.abs(g.aim.x - d.x) + Math.abs(g.aim.y - d.y)
    // Toque rápido num bug é golpe; arrastar e soltar é arremesso.
    if (moved < 10 && performance.now() - d.t < 260) {
      g.held = null
      if (g.bugs.includes(d.b as Bug)) hit(g, d.b as Bug)
      else slash(g, d.x, d.y)
    } else throwHeld(g)
  }

  function onKeyDown(e: KeyboardEvent) {
    const g = G
    if (!g) return
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
    if (k === 'r' && started && !g.paused) { e.preventDefault(); api.start(); return }
    if (k === 'p') { e.preventDefault(); api.togglePause(); return }
    if (!running()) return
    if (MOVE_KEYS.has(k)) { e.preventDefault(); keys[k] = true }
    else if (k === ' ' || k === 'Enter') { e.preventDefault(); slash(g, g.aim.x, g.aim.y) }
    else if (k === 'g' && !g.held && !e.repeat) {
      e.preventDefault()
      const b = grabAt(g, g.aim.x, g.aim.y)
      if (b) g.held = b
    }
  }
  function onKeyUp(e: KeyboardEvent) {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
    keys[k] = false
    if (k === 'g' && G?.held) throwHeld(G)
  }
  function onHidden() {
    if (document.hidden && running()) api.pause(true)
  }
  const ro = new ResizeObserver(() => {
    resize()
    if (G && !running()) drawBase()
  })

  const api: Engine = {
    start() {
      G = newGame()
      G.paused = false
      started = true
      Object.keys(keys).forEach(k => (keys[k] = false))
      canvas.focus()
      on.say('A caçada começou.')
      pushHud(G)
      run()
    },
    pause(paused) {
      const g = G
      if (!g || g.over || g.shop || g.paused === paused) return
      g.paused = paused
      if (paused) on.paused(g.score)
      else {
        canvas.focus()
        run()
      }
    },
    togglePause() {
      if (G && started) api.pause(!G.paused)
    },
    buy(id) {
      const g = G
      const perk = PERKS.find(p => p.id === id)
      if (!g || !g.shop || !perk || g.perks.has(id) || g.frag < perk.cost) return null
      if (perk.needs && !g.perks.has(perk.needs)) return null
      g.frag -= perk.cost
      g.perks.add(id)
      if (id === 'goroutine') g.hunters = [{ a: 0, cd: HUNTER_MS }]
      if (id === 'pool') g.hunters = [0, 1, 2].map(i => ({ a: (i * TAU) / 3, cd: HUNTER_MS + i * 400 }))
      pushHud(g)
      draw(g)
      return shopState(g)
    },
    nextWave() {
      const g = G
      if (!g || !g.shop) return
      g.shop = false
      g.wave++
      g.spawnT = 600
      g.vacT = VACUUM_MS
      if (g.perks.has('docker')) g.core.hp = Math.min(CORE_HP, g.core.hp + 2)
      g.paused = false
      Object.keys(keys).forEach(k => (keys[k] = false))
      canvas.focus()
      on.say(`Onda ${g.wave} de ${WAVES}.`)
      pushHud(g)
      run()
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      G = null
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('keyup', onKeyUp, true)
      document.removeEventListener('visibilitychange', onHidden)
    },
  }

  resize()
  G = newGame()
  drawBase()
  ro.observe(canvas)
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
  document.addEventListener('keydown', onKeyDown, true)
  document.addEventListener('keyup', onKeyUp, true)
  document.addEventListener('visibilitychange', onHidden)
  return api
}
