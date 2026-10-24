import { useEffect, useRef, useState } from 'react'

import { DownloadIcon } from '@/components/icons'
import { profile } from '@/data/profile'
import { navStops, stops } from '@/data/stops'
import { useJourney } from '@/hooks/use-journey'
import { formatElapsed } from '@/lib/visits'

const WELCOME_MS = 4000

export function Header() {
  const { current, events, startedAt, previous } = useJourney()
  const [menuOpen, setMenuOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [welcome, setWelcome] = useState(previous !== null)
  const trackBtnRef = useRef<HTMLButtonElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)

  const delivered = current === 'contato'
  const where = stops.find(stop => stop.id === current)?.label ?? ''
  const state = delivered ? 'Entregue' : welcome ? 'De volta' : 'Em rota'

  // Quem volta vê "De volta" no selo por alguns segundos.
  useEffect(() => {
    if (!welcome) return
    const timer = window.setTimeout(() => setWelcome(false), WELCOME_MS)
    return () => window.clearTimeout(timer)
  }, [welcome])

  useEffect(() => {
    if (!logOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setLogOpen(false)
      trackBtnRef.current?.focus()
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (!logRef.current?.contains(target) && !trackBtnRef.current?.contains(target)) setLogOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [logOpen])

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [events, logOpen])

  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href="#inicio">
          <span className="fore">{profile.forename.toUpperCase()} </span>
          <b>{profile.surname.toUpperCase()}</b>
        </a>
        <nav className={menuOpen ? 'main open' : 'main'} id="menu" aria-label="Seções">
          {navStops.map(stop => (
            <a
              key={stop.id}
              href={`#${stop.id}`}
              aria-current={current === stop.id ? 'true' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {stop.label}
            </a>
          ))}
        </nav>
        <button
          ref={trackBtnRef}
          className={delivered ? 'track-btn done' : 'track-btn'}
          type="button"
          aria-expanded={logOpen}
          aria-controls="tracklog"
          aria-label={`${state} · ${where}: abrir o rastreio desta visita`}
          onClick={() => setLogOpen(open => !open)}
        >
          <span className="pulse" aria-hidden="true" />
          <span className="state" key={state}>
            {state}
          </span>
          <span className="where" key={where}>
            · {where}
          </span>
        </button>
        <button
          className="menu-btn"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={() => setMenuOpen(open => !open)}
        >
          Menu
        </button>
        <a className="cv" href={profile.cvUrl} download aria-label="CV: baixar currículo em PDF">
          <DownloadIcon />
          <span className="label">Currículo</span>
          <span className="label-short">CV</span>
        </a>
        <div className="tracklog" id="tracklog" ref={logRef} hidden={!logOpen}>
          <header>
            <h2>Rastreio desta visita</h2>
            <span className="code">VN-{String(startedAt).slice(-4)}</span>
          </header>
          <ol ref={listRef} aria-live="polite">
            {events.map(event => (
              <li key={event.id} className={event.delivered ? 'delivered' : undefined}>
                <time dateTime={new Date(event.at).toISOString()} title={new Date(event.at).toLocaleTimeString('pt-BR')}>
                  {formatElapsed(event.at - startedAt)}
                </time>
                <i aria-hidden="true" />
                <span>{event.text}</span>
              </li>
            ))}
          </ol>
          <p>É assim que o Rastreia mostra uma entrega para o cliente. Lá, cada evento chega ao vivo por WebSocket.</p>
        </div>
      </div>
    </header>
  )
}
