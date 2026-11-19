import { useEffect, useRef, useState } from 'react'

import { BEST_KEY } from '@/lib/game-loader'
import { prefersReducedMotion } from '@/lib/motion'
import { runtime } from '@/lib/runtime'
import { safeGet, safeSet } from '@/lib/storage'
import { pauseAllFights } from '@/game/fight'
import { CORE_HP, mountEngine, type Engine, type Result, type Shop } from '@/game/caca-bugs/engine'
import { SkillTree } from '@/game/caca-bugs/skill-tree'
import { PERKS, perkName, WAVE_MS, WAVES } from '@/game/caca-bugs/tree'

import '@/game/caca-bugs/caca-bugs.css'

type Props = { onBest(score: number): void; onClose(): void }

type Card = { kind: 'intro' } | { kind: 'pause'; score: number } | { kind: 'tree'; wave: number } | { kind: 'over'; result: Result } | null

const readBest = () => Number(safeGet(BEST_KEY)) || 0

// Abre em <dialog> modal: o foco fica preso no jogo e Esc fecha, sem trap feito à mão.
export default function CacaBugs({ onBest, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const scoreRef = useRef<HTMLElement>(null)
  const timeRef = useRef<HTMLElement>(null)
  const timeLabelRef = useRef<HTMLElement>(null)
  const coreRef = useRef<HTMLElement>(null)
  const relicRef = useRef<HTMLElement>(null)
  const waveRef = useRef<HTMLElement>(null)
  const fragRef = useRef<HTMLElement>(null)
  const fragCellRef = useRef<HTMLElement>(null)
  // A árvore fica fora do `card` para que comprar um nó não roube o foco do botão.
  const [shop, setShop] = useState<Shop | null>(null)
  const [card, setCard] = useState<Card>({ kind: 'intro' })
  const [say, setSay] = useState('')
  const [reduce] = useState(prefersReducedMotion)

  useEffect(() => {
    const dialog = dialogRef.current!
    pauseAllFights()
    runtime.claim('game')
    dialog.showModal()
    const root = document.documentElement
    root.style.overflow = 'hidden'

    const engine = mountEngine(canvasRef.current!, readBest(), {
      hud({ score, time, endless, core, relic, wave, frag }) {
        timeLabelRef.current!.textContent = endless ? 'Sobrevivendo' : 'Tempo'
        // Na onda sem fim não há mais parada na árvore: os fragmentos saem do HUD.
        fragCellRef.current!.hidden = endless
        waveRef.current!.textContent = endless ? `${wave}, sem fim` : `${wave} de ${WAVES}`
        fragRef.current!.textContent = String(frag)
        scoreRef.current!.textContent = String(score)
        timeRef.current!.textContent = `${time} s`
        coreRef.current!.textContent = `${core} de ${CORE_HP}`
        relicRef.current!.textContent = relic
      },
      say: setSay,
      paused: score => setCard({ kind: 'pause', score }),
      shop(s) {
        setShop(s)
        setCard({ kind: 'tree', wave: s.wave })
      },
      over(result) {
        if (result.record) {
          safeSet(BEST_KEY, String(result.score))
          onBest(result.score)
        }
        setCard({ kind: 'over', result })
      },
    })
    engineRef.current = engine

    return () => {
      engine.destroy()
      engineRef.current = null
      root.style.overflow = ''
      runtime.release('game')
      if (dialog.open) dialog.close()
    }
  }, [onBest])

  // Cada cartão novo recebe o foco no primeiro botão.
  useEffect(() => {
    cardRef.current?.querySelector('button')?.focus()
  }, [card])

  function start() {
    setCard(null)
    setShop(null)
    engineRef.current?.start()
  }
  function buy(id: Parameters<Engine['buy']>[0]) {
    const next = engineRef.current?.buy(id)
    if (!next) return
    setShop(next)
    setSay(`${perkName(id)} aprendido. Restam ${next.frag} fragmentos.`)
  }
  function nextWave() {
    setCard(null)
    engineRef.current?.nextWave()
  }
  function resume() {
    setCard(null)
    engineRef.current?.pause(false)
  }

  return (
    <dialog
      className="mg"
      ref={dialogRef}
      aria-label="Mini game Caça-bugs"
      onCancel={e => {
        e.preventDefault()
        onClose()
      }}
    >
      <div className="mg-bar">
        <b>Caça-bugs</b>
        <span className="st">
          Pontos <strong ref={scoreRef}>0</strong>
        </span>
        <span className="st">
          Onda <strong ref={waveRef}>{`1 de ${WAVES}`}</strong>
        </span>
        <span className="st">
          <span ref={timeLabelRef}>Tempo</span> <strong ref={timeRef}>{`${WAVE_MS / 1000} s`}</strong>
        </span>
        <span className="st mg-frag" ref={fragCellRef}>
          Fragmentos <strong ref={fragRef}>0</strong>
        </span>
        <span className="st">
          Produção <strong ref={coreRef}>{`${CORE_HP} de ${CORE_HP}`}</strong>
        </span>
        <span className="st relic">
          Relíquia <strong ref={relicRef}>nenhuma</strong>
        </span>
        <button className="btn" type="button" onClick={() => engineRef.current?.togglePause()}>
          Pausar (P)
        </button>
        <button className="btn" type="button" onClick={onClose}>
          Sair (Esc)
        </button>
      </div>
      <div className="mg-stage">
        <canvas ref={canvasRef} tabIndex={0} aria-label="Arena do Caça-bugs" />
        {card && (
          <div className="mg-veil">
            <div className={card.kind === 'tree' ? 'mg-card wide' : 'mg-card'} ref={cardRef}>
              {card.kind === 'tree' && shop && <SkillTree shop={shop} onBuy={buy} onNext={nextWave} />}
              {card.kind === 'intro' && (
                <>
                  <h2>Caça-bugs</h2>
                  {reduce && <p className="warn">Aviso: este jogo tem movimento rápido na tela. O tremor de câmera fica desligado.</p>}
                  <p>
                    Proteja a <strong>Produção</strong>, no centro. Ela usa o chapéu do caçador: 6 de vida. As {WAVES - 1} primeiras ondas
                    duram {WAVE_MS / 1000} segundos; a onda {WAVES} não tem fim e fica cada vez mais difícil, até a Produção cair.
                  </p>
                  <p>
                    Cada bug caçado vale 1 <strong>fragmento</strong>. Entre as ondas, gaste os fragmentos na árvore de habilidades: Go,
                    React, PostgreSQL e infra viram poderes.
                  </p>
                  <ul>
                    <li>Clique ou toque num bug para golpear. Arraste e arremesse um bug contra os outros: derruba os dois.</li>
                    <li>A luz da lanterna (o seu cursor) deixa os bugs lentos.</li>
                    <li>Bugs duplicados se dividem como O Desincronizado. Bugs pálidos pedem confirmação: dois golpes rápidos, como O Mensageiro.</li>
                    <li>
                      Relíquias do Sobre: <strong>rosa de ferro</strong> protege a Produção, <strong>amigurumi</strong> vira uma bola que quica e
                      esmaga, <strong>bazuca</strong> faz o próximo golpe explodir.
                    </li>
                    <li>Teclado: setas movem a lanterna, Espaço golpeia, segure G para agarrar e solte para arremessar. P pausa, R recomeça, Esc sai.</li>
                  </ul>
                  <div className="row">
                    <button className="btn gold" type="button" onClick={start}>
                      Começar
                    </button>
                    <button className="btn" type="button" onClick={onClose}>
                      Sair
                    </button>
                  </div>
                </>
              )}
              {card.kind === 'pause' && (
                <>
                  <h2>Pausado</h2>
                  <p>Pontos até aqui: {card.score}.</p>
                  <div className="row">
                    <button className="btn gold" type="button" onClick={resume}>
                      Continuar
                    </button>
                    <button className="btn" type="button" onClick={start}>
                      Recomeçar
                    </button>
                    <button className="btn" type="button" onClick={onClose}>
                      Sair
                    </button>
                  </div>
                </>
              )}
              {card.kind === 'over' && (
                <>
                  <h2>{card.result.wave >= WAVES ? `${card.result.endless} segundos na onda sem fim` : 'A Produção caiu'}</h2>
                  <p className="big">{card.result.score} pontos</p>
                  <p>
                    {card.result.kills} bugs caçados em {card.result.seconds} s de partida
                    {card.result.wave < WAVES ? `, até a onda ${card.result.wave} de ${WAVES}` : ''}.{' '}
                    {card.result.record ? 'Novo recorde neste navegador.' : `Recorde: ${card.result.best}.`}
                  </p>
                  {card.result.perks.length ? (
                    <ul className="build" aria-label="Sua build">
                      {card.result.perks.map(id => {
                        const p = PERKS.find(x => x.id === id)!
                        return (
                          <li key={id}>
                            <b>{p.name}</b> <span>({p.branch})</span>: {p.concept}
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="build">Build: nenhum nó, só o golpe.</p>
                  )}
                  <p>{card.result.wave >= WAVES ? 'Persistência paga.' : 'Errar, entender, tentar de novo.'}</p>
                  <div className="row">
                    <button className="btn gold" type="button" onClick={start}>
                      Jogar de novo (R)
                    </button>
                    <button className="btn" type="button" onClick={onClose}>
                      Sair (Esc)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="sr" aria-live="polite">
        {say}
      </p>
    </dialog>
  )
}
