import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

import { fragmentLabels, type Boss } from '@/data/bosses'
import { createFight, type Fight, type Veil } from '@/game/fight'
import { prefersReducedMotion } from '@/lib/motion'
import { openGame } from '@/lib/runtime'

type Props = {
  boss: Boss
  allDefeated: boolean
  onWin(id: Boss['id']): void
}

const veilTitle: Record<Veil, { sup: string; title: (boss: Boss) => string }> = {
  intro: { sup: 'chefe', title: boss => boss.name },
  pause: { sup: 'pausa', title: () => 'Pausado' },
  lose: { sup: 'fim da tentativa', title: () => 'Ainda não.' },
  win: { sup: 'chefe derrotado', title: () => 'Problema resolvido' },
  read: { sup: 'leitura direta', title: () => 'Tudo revelado' },
}

export function BossFight({ boss, allDefeated, onWin }: Props) {
  const [reduce] = useState(prefersReducedMotion)
  const [revealed, setRevealed] = useState<boolean[]>(() => [reduce, reduce, reduce])
  const [veil, setVeil] = useState<Veil | null>('intro')
  const [controls, setControls] = useState(false)
  const [say, setSay] = useState('')

  const rootRef = useRef<HTMLElement>(null)
  const arenaRef = useRef<HTMLDivElement>(null)
  const hunterRef = useRef<HTMLDivElement>(null)
  const bossRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const slashRef = useRef<HTMLDivElement>(null)
  const fxRef = useRef<HTMLDivElement>(null)
  const chargeRef = useRef<HTMLDivElement>(null)
  const comboRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLElement>(null)
  const hpRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const fightRef = useRef<Fight | null>(null)
  const pointerAttack = useRef(false)
  const veilChanged = useRef(false)
  const onWinRef = useRef(onWin)

  useEffect(() => {
    onWinRef.current = onWin
  }, [onWin])

  useEffect(() => {
    const fight = createFight(
      boss,
      {
        arena: arenaRef.current!,
        hunter: hunterRef.current!,
        boss: bossRef.current!,
        ring: ringRef.current!,
        slash: slashRef.current!,
        fx: fxRef.current!,
        charge: chargeRef.current!,
        combo: comboRef.current!,
        bossBar: barRef.current!,
        pips: Array.from(hpRef.current!.querySelectorAll('i')),
      },
      {
        say: setSay,
        reveal: i => setRevealed(prev => (prev[i] ? prev : prev.map((v, j) => v || j === i))),
        veil: kind => {
          veilChanged.current = true
          setVeil(kind)
        },
        controls: setControls,
        won: () => onWinRef.current(boss.id),
      }
    )
    fightRef.current = fight

    // A luta pausa sozinha quando a arena sai da tela.
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) fight.pause()
    }, { threshold: 0.2 })
    io.observe(arenaRef.current!)

    return () => {
      io.disconnect()
      fight.destroy()
      fightRef.current = null
    }
  }, [boss])

  // Cada véu novo recebe o foco no primeiro botão, para o teclado seguir a luta.
  useEffect(() => {
    if (!veilChanged.current || !veil) return
    veilRef.current?.querySelector('button')?.focus({ preventScroll: true })
  }, [veil])

  function read() {
    fightRef.current?.read()
    window.setTimeout(() => {
      rootRef.current?.querySelector('.frag')?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
    }, 0)
  }

  function onArenaDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!controls || (e.target as Element).closest('button')) return
    e.preventDefault()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // sem captura, o soltar ainda chega
    }
    fightRef.current?.chargeStart()
  }

  function onAttackDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (e.button > 0) return
    e.preventDefault()
    pointerAttack.current = true
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // sem captura, o soltar ainda chega
    }
    fightRef.current?.chargeStart()
  }

  // Clique de teclado no botão Atacar vira golpe simples; clique de ponteiro já virou carga.
  function onAttackClick() {
    if (pointerAttack.current) {
      pointerAttack.current = false
      return
    }
    fightRef.current?.tap()
  }

  const release = () => fightRef.current?.chargeRelease()
  const veilText = veil && veilTitle[veil]

  return (
    <article className={`boss${reduce ? ' rm' : ''}`} ref={rootRef} aria-labelledby={`boss-${boss.id}`}>
      <div className="boss-head">
        <h3 id={`boss-${boss.id}`}>
          <sup>{boss.name}</sup>
          {boss.title}
        </h3>
        <p>{boss.stakes}</p>
      </div>
      <div
        className="arena"
        ref={arenaRef}
        tabIndex={-1}
        role="group"
        aria-label={`Arena da luta contra ${boss.name}`}
        onPointerDown={onArenaDown}
        onPointerUp={release}
        onPointerCancel={release}
      >
        <div className="hp" ref={hpRef} aria-hidden="true">
          <span>VIDA</span>
          <i />
          <i />
          <i />
        </div>
        <div className="ground" />
        <div className="ring" ref={ringRef} />
        <div className="ph" ref={hunterRef}>
          <svg viewBox="-110 -390 220 400" aria-hidden="true">
            <use href="#hunter" x="-110" y="-390" width="220" height="400" />
          </svg>
        </div>
        <div className="slash" ref={slashRef} />
        <div className="openmark" aria-hidden="true">
          GUARDA ABERTA
        </div>
        <div className="bh" ref={bossRef}>
          <BossArt id={boss.id} />
        </div>
        <div className="bossbar" aria-hidden="true">
          <b>{boss.name}</b>
          <i ref={barRef} />
        </div>
        <div className="chg" ref={chargeRef} aria-hidden="true" />
        <div className="combo" ref={comboRef} aria-hidden="true" />
        <div className="tip" aria-hidden="true">
          {boss.tip}
        </div>
        <div className="fx" ref={fxRef} aria-hidden="true" />
        {veil && veilText && (
          <div className={`veil ${veil}`} ref={veilRef}>
            <h4>
              <sup>{veilText.sup}</sup>
              {veilText.title(boss)}
            </h4>
            <p>{veilMessage(veil, boss, allDefeated)}</p>
            <div className="row">
              {veil === 'pause' && (
                <button className="btn gold" type="button" onClick={() => fightRef.current?.resume()}>
                  Continuar
                </button>
              )}
              {veil === 'win' && allDefeated && (
                <button className="btn gold" type="button" onClick={openGame}>
                  Jogar Caça-bugs
                </button>
              )}
              {veil !== 'pause' && (
                <button
                  className={`btn${veil === 'read' || (veil === 'win' && allDefeated) ? '' : ' gold'}`}
                  type="button"
                  onClick={() => fightRef.current?.start()}
                >
                  {veil === 'intro' ? 'Lutar' : veil === 'lose' ? 'Tentar de novo' : veil === 'read' ? 'Lutar mesmo assim' : 'Lutar de novo'}
                </button>
              )}
              {(veil === 'intro' || veil === 'pause' || veil === 'lose') && (
                <button className="btn" type="button" onClick={read}>
                  Ler sem lutar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="ctrl" hidden={!controls}>
        <button className="btn" type="button" onClick={() => fightRef.current?.dodge()}>
          Esquivar <kbd>Espaço</kbd>
        </button>
        <button
          className="btn gold"
          type="button"
          onPointerDown={onAttackDown}
          onPointerUp={release}
          onPointerCancel={release}
          onContextMenu={e => e.preventDefault()}
          onClick={onAttackClick}
        >
          Atacar · segure <kbd>Enter</kbd>
        </button>
        <button className="btn" type="button" onClick={() => fightRef.current?.pause()}>
          Pausar <kbd>Esc</kbd>
        </button>
        <button className="btn" type="button" onClick={read}>
          Ler sem lutar
        </button>
      </div>
      <p className="say" aria-live="polite">
        {say}
      </p>
      <p className="rmnote">Animações reduzidas: a luta vira leitura direta.</p>
      <ol className="frags">
        {boss.fragments.map((text, i) => (
          <li key={fragmentLabels[i]} className={`frag${revealed[i] ? ' open' : ''}`}>
            <span className="n">
              {fragmentLabels[i]} <span>{revealed[i] ? 'revelado' : 'selado'}</span>
            </span>
            {revealed[i] ? <p className="txt">{text}</p> : <p className="seal">Acerte o chefe para revelar.</p>}
          </li>
        ))}
      </ol>
    </article>
  )
}

function veilMessage(veil: Veil, boss: Boss, allDefeated: boolean) {
  switch (veil) {
    case 'intro':
      return `Esquive quando o círculo fechar. Segure Atacar (ou Enter) para carregar e solte quando a guarda abrir: golpe carregado vale dois. ${boss.hint}`
    case 'pause':
      return 'Os fragmentos revelados continuam abertos.'
    case 'lose':
      return 'Errar, entender, tentar de novo. Os fragmentos que você revelou continuam abertos.'
    case 'win':
      return allDefeated ? 'Os três chefes caíram. Sobrou bug? O Caça-bugs está logo ali.' : 'O risco, a solução e o resultado estão abertos logo abaixo.'
    case 'read':
      return 'O risco, a solução e o resultado estão logo abaixo.'
  }
}

function BossArt({ id }: { id: Boss['id'] }) {
  if (id === 1)
    return (
      <svg viewBox="0 0 120 160" aria-hidden="true">
        <g className="dsync" fill="#1E1A26" stroke="#4A4458" strokeWidth="1.5">
          <path d="M60 10 L74 34 L70 40 L88 158 L32 158 L50 40 L46 34 Z" opacity=".35" transform="translate(-14 4)" />
          <path d="M60 10 L74 34 L70 40 L88 158 L32 158 L50 40 L46 34 Z" opacity=".35" transform="translate(14 -3)" />
          <path d="M60 10 L74 34 L70 40 L88 158 L32 158 L50 40 L46 34 Z" />
        </g>
        <rect x="53" y="27" width="5" height="3" fill="#D2384F" />
        <rect x="63" y="27" width="5" height="3" fill="#A9D6E5" />
      </svg>
    )
  if (id === 2)
    return (
      <svg viewBox="0 0 120 160" aria-hidden="true">
        <path d="M60 12 Q86 14 88 46 L98 158 L22 158 L32 46 Q34 14 60 12 Z" fill="#1E1A26" stroke="#4A4458" strokeWidth="1.5" />
        <ellipse cx="60" cy="40" rx="14" ry="17" fill="#07060A" />
        <circle cx="60" cy="40" r="2.5" fill="#E3C17A" />
        <g fill="none" stroke="#A8A1B3" strokeWidth="1.5">
          <rect x="4" y="60" width="18" height="12" />
          <path d="M4 60l9 7 9-7" />
          <rect x="98" y="88" width="18" height="12" />
          <path d="M98 88l9 7 9-7" />
          <rect x="10" y="112" width="16" height="11" opacity=".5" />
        </g>
      </svg>
    )
  return (
    <svg viewBox="0 0 120 160" aria-hidden="true">
      <path d="M60 14 Q80 16 80 42 L92 158 L28 158 L40 42 Q40 16 60 14 Z" fill="#1E1A26" stroke="#4A4458" strokeWidth="1.5" />
      <path d="M46 34 Q60 26 74 34 L72 46 Q60 42 48 46 Z" fill="#CFC8BC" />
      <circle cx="54" cy="38" r="2" fill="#07060A" />
      <circle cx="66" cy="38" r="2" fill="#07060A" />
      <g stroke="#E3C17A" strokeWidth="2.5" fill="none">
        <circle cx="100" cy="74" r="7" />
        <path d="M100 81v26M100 98h7M100 104h5" />
      </g>
    </svg>
  )
}
