import { useCallback, useEffect, useState } from 'react'

import { BossFight } from '@/components/boss-fight'
import { SectionHead } from '@/components/section-head'
import { bosses, type Boss } from '@/data/bosses'
import { activeFight, pauseAllFights } from '@/game/fight'
import { runtime, STRAY_BUG_EVENT } from '@/lib/runtime'

const DODGE_KEYS = new Set([' ', 'ArrowLeft', 'a', 'A'])
const ATTACK_KEYS = new Set(['Enter', 'ArrowRight', 'd', 'D', 'j', 'J'])
const PAUSE_KEYS = new Set(['Escape', 'p', 'P'])

export function Bosses() {
  const [defeated, setDefeated] = useState<Set<Boss['id']>>(() => new Set())

  const onWin = useCallback((id: Boss['id']) => {
    setDefeated(prev => new Set(prev).add(id))
    // Um bug escapa da luta pouco depois da vitória.
    window.setTimeout(() => window.dispatchEvent(new Event(STRAY_BUG_EVENT)), 3600)
  }, [])

  // Teclado da luta ativa: Espaço esquiva, segurar Enter carrega o golpe, Esc pausa.
  useEffect(() => {
    function onDown(e: KeyboardEvent) {
      const fight = activeFight()
      if (!fight) return
      if (DODGE_KEYS.has(e.key)) {
        e.preventDefault()
        fight.dodge()
      } else if (ATTACK_KEYS.has(e.key)) {
        e.preventDefault()
        if (!e.repeat) fight.chargeStart()
      } else if (PAUSE_KEYS.has(e.key)) {
        e.preventDefault()
        fight.pause()
      }
    }
    function onUp(e: KeyboardEvent) {
      const fight = activeFight()
      if (!fight || !ATTACK_KEYS.has(e.key)) return
      e.preventDefault()
      fight.chargeRelease()
    }
    function onHidden() {
      if (document.hidden) pauseAllFights()
    }
    const unsubscribe = runtime.subscribe(() => {
      if (runtime.get().paused) pauseAllFights()
    })
    document.addEventListener('keydown', onDown)
    document.addEventListener('keyup', onUp)
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      unsubscribe()
      document.removeEventListener('keydown', onDown)
      document.removeEventListener('keyup', onUp)
      document.removeEventListener('visibilitychange', onHidden)
    }
  }, [])

  const allDefeated = defeated.size === bosses.length

  return (
    <section className="block wrap" id="desafios" aria-labelledby="h-desafios">
      <div className="inner">
        <SectionHead
          id="desafios"
          sub="Três problemas reais, cada um como um chefe. Cada golpe certo revela uma parte: o risco, a solução e o resultado. Prefere ler direto? Use “Ler sem lutar”."
        />
        <div className="bosses">
          {bosses.map(boss => (
            <BossFight key={boss.id} boss={boss} allDefeated={allDefeated} onWin={onWin} />
          ))}
        </div>
      </div>
    </section>
  )
}
