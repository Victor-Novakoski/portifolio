import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { profile } from '@/data/profile'
import { prefersReducedMotion } from '@/lib/motion'
import { runtime, STRAY_BUG_EVENT } from '@/lib/runtime'
import { mountTitleScene, type TitleScene } from '@/scene/title-scene'

const IGNORED_KEYS = new Set(['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'ContextMenu'])

function goToMenu() {
  document.getElementById('menu')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  document.querySelector<HTMLAnchorElement>('#menu li:not([hidden]) a')?.focus({ preventScroll: true })
}

export function TitleScreen() {
  const titleRef = useRef<HTMLElement>(null)
  const skyRef = useRef<HTMLCanvasElement>(null)
  const propsRef = useRef<HTMLCanvasElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<TitleScene | null>(null)
  const [hatNote, setHatNote] = useState('')

  // Canvas do céu, chapéu e lanterna.
  useEffect(() => {
    let noteT = 0
    const scene = mountTitleScene(titleRef.current!, {
      sky: skyRef.current!,
      props: propsRef.current!,
      hud: hudRef.current!,
      onHatNote() {
        setHatNote(profile.hatNote)
        window.clearTimeout(noteT)
        noteT = window.setTimeout(() => setHatNote(''), 8000)
      },
    })
    sceneRef.current = scene
    return () => {
      window.clearTimeout(noteT)
      scene.destroy()
      sceneRef.current = null
    }
  }, [])

  // A ficha do caçador "se imprime" na chegada (~1 s). Qualquer gesto encerra na hora.
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('printing')) return
    const events = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const
    const stop = () => root.classList.remove('printing')
    const t = window.setTimeout(stop, 1150)
    events.forEach(type => window.addEventListener(type, stop, { capture: true, once: true }))
    return () => {
      window.clearTimeout(t)
      events.forEach(type => window.removeEventListener(type, stop, { capture: true }))
      stop()
    }
  }, [])

  // "Pressione qualquer tecla" no topo da página, sem roubar o teclado de quem está navegando.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (runtime.get().active) return
      if (window.scrollY > 40 || e.ctrlKey || e.metaKey || e.altKey || IGNORED_KEYS.has(e.key)) return
      const ae = document.activeElement
      if (ae && ae !== document.body && ae.id !== 'start') return
      e.preventDefault()
      goToMenu()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Segredos: digitar "chapéu" ergue o chapéu; "bug" solta um bug pela tela.
  useEffect(() => {
    let typed = ''
    function onKey(e: KeyboardEvent) {
      if (runtime.get().active || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      typed = (typed + e.key.toLowerCase()).slice(-8)
      if (/bug$/.test(typed)) {
        typed = ''
        window.dispatchEvent(new Event(STRAY_BUG_EVENT))
      } else if (/chap[eé]u$/.test(typed)) {
        typed = ''
        sceneRef.current?.tipHat()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section className="title" id="topo" ref={titleRef} aria-label="Apresentação">
      <canvas ref={skyRef} aria-hidden="true" />
      <canvas className="props" ref={propsRef} aria-hidden="true" />
      <div className="hud wrap">
        <div className="inner hud-l" ref={hudRef}>
          <span className="tag">Personagem · nível full stack</span>
          <h1>{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <ul className="equip" aria-label="Stack principal">
            {profile.stack.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="bars" aria-hidden="true">
            <div className="bar">
              <span>Vida</span>
              <i style={{ '--c': 'var(--blood)' } as CSSProperties} />
            </div>
            <div className="bar">
              <span>Vigor</span>
              <i style={{ '--c': 'var(--gold)', '--r': '18%' } as CSSProperties} />
            </div>
          </div>
          <p className="status">
            {profile.status.base} · <b>{profile.status.availability}</b>. {profile.status.summary}
          </p>
          <div className="ctas">
            <a className="btn gold" href={profile.cvUrl} download>
              Baixar currículo (PDF)
            </a>
            <a className="btn" href="#desafios">
              Enfrentar os desafios
            </a>
          </div>
          <p className="hatnote" role="status">
            {hatNote}
          </p>
          <div>
            <button className="btn sr-f" type="button" onClick={() => sceneRef.current?.throwHat()}>
              Arremessar o chapéu do caçador
            </button>
            <button className="btn sr-f" type="button" onClick={() => sceneRef.current?.swingLamp()}>
              Balançar a lanterna
            </button>
          </div>
          <i className="phead" aria-hidden="true" />
        </div>
        <div className="press inner">
          <button type="button" id="start" onClick={goToMenu}>
            <span className="t-key">Pressione qualquer tecla</span>
            <span className="t-touch">Toque para começar</span>
          </button>
        </div>
      </div>
    </section>
  )
}
