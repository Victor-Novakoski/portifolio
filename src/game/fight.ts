import type { Boss } from '@/data/bosses'
import { debris } from '@/lib/debris'
import { prefersReducedMotion, rnd } from '@/lib/motion'
import { runtime } from '@/lib/runtime'

// Luta contra um chefe: esquivar quando o círculo fecha, segurar para carregar e soltar quando a guarda abre.
// Cada acerto revela um fragmento (o risco, a solução, o resultado). Portado do protótipo "Forja do Caçador";
// o React cuida do texto e dos véus, e este módulo mexe só nas peças da arena.

export type Veil = 'intro' | 'pause' | 'lose' | 'win' | 'read'

export type FightElements = {
  arena: HTMLElement
  hunter: HTMLElement
  boss: HTMLElement
  ring: HTMLElement
  slash: HTMLElement
  fx: HTMLElement
  charge: HTMLElement
  combo: HTMLElement
  bossBar: HTMLElement
  pips: HTMLElement[]
}

export type FightEvents = {
  say(text: string): void
  reveal(index: number): void
  veil(kind: Veil | null): void
  controls(visible: boolean): void
  won(): void
}

export type Fight = {
  start(): void
  dodge(): void
  chargeStart(): void
  chargeRelease(): void
  tap(): void
  pause(): void
  resume(): void
  read(): void
  destroy(): void
}

type Phase = 'idle' | 'wind' | 'strike' | 'open' | 'ack'

const ONOMATOPOEIA = ['CRAC!', 'TUM!', 'ZÁS!', 'PÁ!']
const FRAGMENT_NAMES = ['o risco', 'a solução', 'o resultado']
const CHARGE_MS = 700
const HP_MAX = 3

// Só uma luta por vez fica com o teclado.
let active: Fight | null = null
const all = new Set<Fight>()
let lastInk = 0

export const activeFight = () => active

export function createFight(boss: Boss, els: FightElements, on: FightEvents): Fight {
  const { arena, hunter: ph, boss: bh, ring, slash, fx: layer, charge: chg, combo: cbx, bossBar, pips } = els
  const reduce = prefersReducedMotion()
  const B = boss.id

  let state: 'ready' | 'fight' | 'paused' | 'over' = 'ready'
  let phase: Phase = 'idle'
  let pt = 0
  let dur = 1200
  let hp = HP_MAX
  let hits = 0
  let inv = 0
  let atkCd = 0
  let dodgeCd = 0
  let resolved = false
  let struck = false
  let last = 0
  let raf = 0
  let freeze = 0
  let echo = false
  let grab = false
  let crit = false
  let bossKick = 0
  let bossKickV = 0
  let hunterKick = 0
  let hunterKickV = 0
  let charging = false
  let chargeT0 = 0
  let combo = 0
  const timers = new Set<number>()

  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(() => {
      timers.delete(t)
      fn()
    }, ms)
    timers.add(t)
  }
  const restart = (el: HTMLElement, cls: string) => {
    el.classList.remove(cls)
    void el.offsetWidth
    el.classList.add(cls)
  }

  function syncHud() {
    pips.forEach((pip, i) => pip.classList.toggle('lost', i >= hp))
    bossBar.style.setProperty('--w', `${((3 - hits) / 3) * 100}%`)
    bh.classList.toggle('split', B === 1 && hits >= 1)
  }

  function center(el: HTMLElement) {
    const ar = arena.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return { x: r.left - ar.left + r.width / 2, y: r.top - ar.top + r.height * 0.35 }
  }

  function float(text: string, kind: '' | 'bad' | 'par', onHunter = false) {
    const c = center(onHunter ? ph : bh)
    const d = document.createElement('span')
    d.className = `dmg ${kind}`
    d.textContent = text
    d.style.left = `${c.x}px`
    d.style.top = `${c.y - 14}px`
    layer.appendChild(d)
    later(() => d.remove(), 800)
    const color = kind === 'bad' ? '#D2384F' : kind === 'par' ? '#A9D6E5' : '#E3C17A'
    debris(layer, c.x, c.y + 20, color, kind === 'par' ? 5 : 10, arena.clientHeight - 37)
    if (onHunter) hunterKickV -= 9
    else bossKickV += kind === 'par' ? 6 : 13
    restart(arena, 'shake')
  }

  // Impact frame: inverte a arena por um instante, explode tinta e solta uma onomatopeia.
  function inkFrame(big: boolean) {
    if (reduce) return
    const now = performance.now()
    const c = center(bh)
    if (now - lastInk > 340 && arena.animate) {
      lastInk = now
      arena.animate([{ filter: 'invert(1) contrast(1.3)' }, { filter: 'invert(1) contrast(1.3)' }], { duration: 110 })
    }
    const burst = document.createElement('div')
    burst.className = 'inkburst'
    burst.style.left = `${c.x}px`
    burst.style.top = `${c.y}px`
    layer.appendChild(burst)
    later(() => burst.remove(), 380)
    const tone = document.createElement('div')
    tone.className = 'halftone'
    layer.appendChild(tone)
    later(() => tone.remove(), 220)
    const ono = document.createElement('span')
    ono.className = 'ono'
    ono.textContent = ONOMATOPOEIA[Math.floor(Math.random() * ONOMATOPOEIA.length)]
    ono.style.left = `${Math.max(8, c.x - 120)}px`
    ono.style.top = `${Math.max(6, c.y - 70)}px`
    layer.appendChild(ono)
    ono.animate?.(
      [
        { transform: `rotate(-12deg) scale(${big ? 1.9 : 1.4})`, opacity: 0 },
        { transform: 'rotate(-8deg) scale(1)', opacity: 1, offset: 0.35 },
        { transform: 'rotate(-8deg) scale(1.05)', opacity: 0 },
      ],
      { duration: 620, easing: 'ease-out', fill: 'forwards' }
    )
    later(() => ono.remove(), 640)
  }

  function showCombo() {
    if (combo < 2 || reduce) return
    cbx.textContent = `${combo} HITS${combo >= 3 ? '!' : ''}`
    const base = 'translateX(-50%) rotate(-5deg)'
    cbx.animate?.(
      [
        { opacity: 0, transform: `${base} scale(1.8)` },
        { opacity: 1, transform: `${base} scale(.95)`, offset: 0.25 },
        { opacity: 1, transform: `${base} scale(1)`, offset: 0.8 },
        { opacity: 0, transform: `${base} scale(1)` },
      ],
      { duration: 1100, fill: 'forwards' }
    )
  }

  function hurt(text = '-1') {
    hp--
    combo = 0
    syncHud()
    freeze = 80
    restart(ph, 'hurt')
    float(text, 'bad', true)
  }

  function go(p: Phase) {
    phase = p
    pt = 0
    resolved = false
    bh.classList.remove('wind', 'open', 'grab')
    arena.classList.remove('is-open')
    ring.style.opacity = '0'
    ring.classList.remove('gold', 'par')
    if (p === 'idle') {
      dur = rnd(1200, 1900)
      echo = grab = crit = false
      bh.classList.remove('gone')
    } else if (p === 'wind') {
      if (echo) {
        dur = 440
        bh.classList.add('wind')
        on.say('A cópia atrasada ataca de novo!')
      } else {
        dur = [950, 820, 700][hits] ?? 700
        grab = B === 3 && hits >= 1 && Math.random() < 0.5
        if (grab) {
          dur += 150
          ring.classList.add('gold')
          bh.classList.add('grab')
          on.say('Ele vai roubar sua sessão! Esquiva não adianta: apare no último instante.')
        } else {
          bh.classList.add('wind')
          on.say(`${boss.name} prepara um golpe. Esquive quando o círculo fechar.`)
        }
      }
    } else if (p === 'strike') {
      dur = 320
      restart(slash, 'go')
    } else if (p === 'open') {
      dur = crit ? 1300 : ([1000, 900, 800][hits] ?? 800)
      struck = false
      bh.classList.add('open')
      arena.classList.add('is-open')
      on.say(crit ? 'Guarda quebrada! Ataque!' : 'Guarda aberta. Ataque!')
    } else if (p === 'ack') {
      dur = 900
      bh.classList.add('gone')
      on.say('Golpe entregue. Confirme: ataque de novo!')
    }
  }

  function next() {
    if (phase === 'idle') go('wind')
    else if (phase === 'wind') go('strike')
    else if (phase === 'strike') {
      // O Desincronizado, depois do 1º golpe, ataca uma segunda vez fora de sincronia.
      if (B === 1 && hits >= 1 && !echo) {
        echo = true
        go('wind')
      } else go('open')
    } else if (phase === 'ack') {
      bh.classList.remove('gone')
      float('SEM ACK', 'par')
      on.say('Sem confirmação: o golpe voltou para a fila.')
      go('idle')
    } else go('idle')
  }

  function chargeVisual() {
    if (!charging) {
      chg.style.opacity = '0'
      arena.style.translate = ''
      ph.classList.remove('charging', 'full')
      return
    }
    const pw = Math.min(1, (performance.now() - chargeT0) / CHARGE_MS)
    chg.style.opacity = (pw * 0.85).toFixed(2)
    chg.style.transform = `scale(${(1.25 - 0.25 * pw).toFixed(3)})`
    const a = reduce ? 0 : pw * pw * 3.2
    arena.style.translate = `${(Math.random() * 2 - 1) * a}px ${(Math.random() * 2 - 1) * a}px`
    ph.classList.add('charging')
    if (pw >= 1 && !ph.classList.contains('full')) {
      ph.classList.add('full')
      on.say('Golpe carregado. Solte quando a guarda abrir!')
    }
  }

  function step(now: number) {
    raf = 0
    if (state !== 'fight') return
    const dt = Math.min(50, now - last)
    last = now
    chargeVisual()
    if (freeze > 0) {
      // Hitstop: tudo congela por alguns quadros depois de um golpe.
      freeze -= dt
      raf = requestAnimationFrame(step)
      return
    }
    bossKickV += -bossKick * 0.2
    bossKickV *= 0.78
    bossKick += bossKickV
    hunterKickV += -hunterKick * 0.2
    hunterKickV *= 0.78
    hunterKick += hunterKickV
    bh.style.translate = `${bossKick.toFixed(1)}px 0`
    ph.style.translate = `${hunterKick.toFixed(1)}px 0`
    pt += dt
    inv = Math.max(0, inv - dt)
    atkCd = Math.max(0, atkCd - dt)
    dodgeCd = Math.max(0, dodgeCd - dt)
    if (inv <= 0) ph.classList.remove('dodge')
    if (phase === 'wind') {
      const k = Math.min(1, pt / dur)
      ring.style.opacity = String(0.3 + k * 0.7)
      ring.style.transform = `scale(${1.8 - 0.8 * k})`
    }
    if (phase === 'strike' && !resolved && pt >= 140) {
      resolved = true
      if (grab) {
        hurt('SESSÃO ROUBADA')
        if (hits > 0) {
          hits--
          syncHud()
          on.say('Sessão roubada: ele usou seu token e recuperou vida. Apare para rotacionar.')
        } else on.say('Sessão roubada. Apare para rotacionar o token.')
        if (hp <= 0) return lose()
      } else if (inv > 0) on.say('Esquivou.')
      else {
        hurt()
        on.say(hp > 0 ? `Atingido. Restam ${hp} de vida.` : 'Atingido.')
        if (hp <= 0) return lose()
      }
    }
    if (pt >= dur) next()
    raf = requestAnimationFrame(step)
  }

  function run() {
    last = performance.now()
    if (!raf) raf = requestAnimationFrame(step)
  }

  function landed(n: number, label: string) {
    for (let i = 0; i < n && hits < 3; i++) {
      on.reveal(hits)
      hits++
    }
    combo += n
    syncHud()
    restart(bh, 'stag')
    showCombo()
    if (hits >= 3) return win()
    on.say(`${label} Fragmento revelado: ${FRAGMENT_NAMES[hits - 1]}.`)
    go('idle')
  }

  function attack(power: number) {
    if (state !== 'fight' || atkCd > 0 || freeze > 0) return
    const max = power >= 1
    atkCd = 380
    restart(ph, 'lunge')
    later(() => ph.classList.remove('lunge'), 220)
    const parryWindow = grab ? 260 : 150
    // Aparar: golpear no último instante antes do ataque do chefe quebra a guarda dele.
    if ((phase === 'wind' && pt >= dur - parryWindow) || (phase === 'strike' && !resolved)) {
      resolved = true
      ring.style.opacity = '1'
      ring.classList.add('par')
      freeze = max ? 170 : 120
      restart(bh, 'stag')
      float(grab ? 'TOKEN ROTACIONADO' : 'APARADO', 'par')
      if (max) inkFrame(false)
      on.say(grab ? 'Reuso detectado: a sessão do ladrão caiu. Guarda quebrada!' : 'Aparou! Guarda quebrada, ataque!')
      crit = true
      go('open')
      return
    }
    if (phase === 'ack') {
      bh.classList.remove('gone')
      freeze = 100
      float('CONFIRMADO', '')
      landed(1, 'Confirmado.')
      return
    }
    if (phase === 'open' && !struck) {
      struck = true
      // O Mensageiro Esquecido pede confirmação; um golpe carregado confirma na hora.
      if (B === 2 && !max) {
        freeze = 70
        atkCd = 160
        float('ENTREGUE', '')
        go('ack')
        return
      }
      const n = max ? 2 : 1
      const finishing = hits + n >= 3
      freeze = max ? 180 : crit ? 150 : 90
      float(max ? 'GOLPE MÁXIMO' : crit ? 'CRÍTICO' : '-1', '')
      if (max || crit || finishing) inkFrame(max || finishing)
      landed(n, max ? 'Golpe máximo: dois fragmentos.' : crit ? 'Golpe crítico.' : 'Acertou.')
      return
    }
    if (phase === 'wind') {
      hurt()
      on.say('Cedo demais: o chefe contra-atacou.')
      if (hp <= 0) lose()
      return
    }
    atkCd = 700
    float('DEFENDIDO', 'par')
    on.say('Defendido. Espere a guarda abrir.')
  }

  function chargeStop() {
    charging = false
    chargeVisual()
  }

  function end() {
    chargeStop()
    state = 'over'
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    bossKick = bossKickV = hunterKick = hunterKickV = 0
    bh.style.translate = ''
    ph.style.translate = ''
    arena.classList.remove('live', 'is-open')
    bh.classList.remove('wind', 'open', 'grab', 'gone')
    ring.style.opacity = '0'
    release()
    on.controls(false)
  }

  function release() {
    if (active === fight) {
      active = null
      runtime.release('fight')
    }
  }

  function claim() {
    all.forEach(other => {
      if (other !== fight) other.pause()
    })
    active = fight
    runtime.claim('fight')
  }

  function lose() {
    end()
    on.veil('lose')
    on.say('Você caiu. Tente de novo ou leia sem lutar.')
  }

  function win() {
    end()
    on.veil('win')
    on.say(`${boss.name} derrotado. Os três fragmentos foram revelados.`)
    on.won()
  }

  const fight: Fight = {
    start() {
      claim()
      state = 'fight'
      hp = HP_MAX
      hits = 0
      combo = 0
      inv = atkCd = dodgeCd = freeze = 0
      echo = grab = crit = false
      syncHud()
      bh.classList.remove('gone')
      arena.classList.add('live')
      on.veil(null)
      on.controls(true)
      arena.focus({ preventScroll: true })
      go('idle')
      pt = 400
      on.say('A luta começou. Espaço esquiva; segure Enter para carregar e solte para golpear; Esc pausa.')
      run()
    },
    dodge() {
      if (state !== 'fight' || dodgeCd > 0) return
      inv = 460
      dodgeCd = 760
      ph.classList.add('dodge')
    },
    chargeStart() {
      if (state !== 'fight' || charging) return
      charging = true
      chargeT0 = performance.now()
    },
    chargeRelease() {
      if (!charging) return
      const power = Math.max(0.25, Math.min(1, (performance.now() - chargeT0) / CHARGE_MS))
      chargeStop()
      attack(power)
    },
    tap() {
      attack(0.25)
    },
    pause() {
      if (state !== 'fight') return
      chargeStop()
      state = 'paused'
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      release()
      on.veil('pause')
      on.say('Luta pausada.')
    },
    resume() {
      if (state !== 'paused') return
      runtime.setPaused(false)
      claim()
      state = 'fight'
      on.veil(null)
      arena.focus({ preventScroll: true })
      on.say('Luta retomada.')
      run()
    },
    read() {
      for (let i = 0; i < 3; i++) on.reveal(i)
      end()
      on.veil('read')
      on.say('Fragmentos revelados.')
    },
    destroy() {
      end()
      timers.forEach(t => window.clearTimeout(t))
      timers.clear()
      all.delete(fight)
    },
  }

  all.add(fight)
  syncHud()
  return fight
}

export function pauseAllFights() {
  all.forEach(f => f.pause())
}
