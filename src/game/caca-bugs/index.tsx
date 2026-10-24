import { useEffect, useRef, useState } from 'react'

import { BEST_KEY } from '@/lib/game-loader'
import { prefersReducedMotion } from '@/lib/motion'
import { runtime } from '@/lib/runtime'
import { safeGet, safeSet } from '@/lib/storage'
import { pauseAllFights } from '@/game/fight'
import { CORE_HP, mountEngine, type Engine, type Result } from '@/game/caca-bugs/engine'

import '@/game/caca-bugs/caca-bugs.css'

type Props = { onBest(score: number): void; onClose(): void }

type Card = { kind: 'intro' } | { kind: 'pause'; score: number } | { kind: 'over'; result: Result } | null

const readBest = () => Number(safeGet(BEST_KEY)) || 0

// Abre em <dialog> modal: o foco fica preso no jogo e Esc fecha, sem trap feito à mão.
export default function CacaBugs({ onBest, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const scoreRef = useRef<HTMLElement>(null)
  const timeRef = useRef<HTMLElement>(null)
  const coreRef = useRef<HTMLElement>(null)
  const relicRef = useRef<HTMLElement>(null)
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
      hud({ score, time, core, relic }) {
        scoreRef.current!.textContent = String(score)
        timeRef.current!.textContent = `${time} s`
        coreRef.current!.textContent = `${core} de ${CORE_HP}`
        relicRef.current!.textContent = relic
      },
      say: setSay,
      paused: score => setCard({ kind: 'pause', score }),
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
    engineRef.current?.start()
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
          Tempo <strong ref={timeRef}>75 s</strong>
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
            <div className="mg-card" ref={cardRef}>
              {card.kind === 'intro' && (
                <>
                  <h2>Caça-bugs</h2>
                  {reduce && <p className="warn">Aviso: este jogo tem movimento rápido na tela. O tremor de câmera fica desligado.</p>}
                  <p>
                    Proteja a <strong>Produção</strong>, no centro, por 75 segundos. Ela usa o chapéu do caçador: 6 de vida.
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
                  <h2>{card.result.survived ? 'A Produção resistiu' : 'A Produção caiu'}</h2>
                  <p className="big">{card.result.score} pontos</p>
                  <p>
                    {card.result.kills} bugs caçados. {card.result.record ? 'Novo recorde neste navegador.' : `Recorde: ${card.result.best}.`}
                  </p>
                  <p>{card.result.survived ? 'Persistência paga.' : 'Errar, entender, tentar de novo.'}</p>
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
