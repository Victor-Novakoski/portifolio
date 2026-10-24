import { useEffect, useRef, useState } from 'react'

import { profile } from '@/data/profile'
import { sectionById } from '@/data/sections'
import { runtime } from '@/lib/runtime'

// Faixa curta para quem volta: um atalho para a seção onde parou e o CV. Some sozinha em 12 s.
export function ReturnStrip({ sectionId }: { sectionId: string }) {
  const section = sectionById(sectionId)!
  const [state, setState] = useState<'waiting' | 'shown' | 'leaving' | 'gone'>('waiting')
  const holdRef = useRef(false)

  useEffect(() => {
    const t = window.setTimeout(() => setState('shown'), 700)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (state === 'leaving') {
      const t = window.setTimeout(() => setState('gone'), 260)
      return () => window.clearTimeout(t)
    }
    if (state !== 'shown') return
    let t = 0
    const arm = () => {
      t = window.setTimeout(() => (holdRef.current ? arm() : setState('leaving')), 12000)
    }
    arm()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !runtime.get().active) setState('leaving')
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [state])

  if (state === 'waiting' || state === 'gone') return null

  const hide = () => setState('leaving')
  const hold = (on: boolean) => () => {
    holdRef.current = on
  }

  return (
    <div
      className={`back${state === 'leaving' ? ' out' : ''}`}
      role="status"
      onMouseEnter={hold(true)}
      onMouseLeave={hold(false)}
      onFocus={hold(true)}
      onBlur={hold(false)}
    >
      <p className="msg">
        <b>Continuar jogo?</b>Bom te ver de novo. O CV continua aqui.
      </p>
      <div className="acts">
        <a className="btn" href={`#${section.id}`} onClick={() => window.setTimeout(hide, 50)}>
          Continuar em {section.label}
        </a>
        <a className="btn gold" href={profile.cvUrl} download>
          Baixar CV
        </a>
      </div>
      <button className="x" type="button" aria-label="Fechar aviso" onClick={hide}>
        ×
      </button>
    </div>
  )
}
