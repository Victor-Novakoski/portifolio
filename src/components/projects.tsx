import { useEffect } from 'react'

import { ItemIcon } from '@/components/icons'
import { SearchDemo } from '@/components/search-demo'
import { SectionHead } from '@/components/section-head'
import { projects } from '@/data/projects'

// Card aberto por âncora (/#rastreia, citada no currículo). O navegador tenta rolar antes de o
// React desenhar a página e as fontes mudam a altura do que vem antes; por isso rola de novo
// depois da montagem e quando as fontes chegam. Qualquer gesto do visitante cancela.
function useProjectAnchor() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!projects.some(p => p.id === id)) return
    let active = true
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    const stop = () => {
      active = false
      events.forEach(type => window.removeEventListener(type, stop, { capture: true }))
    }
    const go = () => {
      if (active) document.getElementById(id)?.scrollIntoView({ block: 'start' })
    }
    events.forEach(type => window.addEventListener(type, stop, { capture: true, passive: true }))
    go()
    document.fonts?.ready.then(go)
    const t = window.setTimeout(() => {
      go()
      stop()
    }, 1500)
    return () => {
      window.clearTimeout(t)
      stop()
    }
  }, [])
}

export function Projects() {
  useProjectAnchor()

  return (
    <section className="block wrap" id="projetos" aria-labelledby="h-projetos">
      <div className="inner">
        <SectionHead id="projetos" sub="Dois projetos completos e um jogo, cada um com a descrição do item e a ficha técnica." />
        <div className="inv">
          {projects.map(p => (
            <article key={p.id} id={p.id} className={`item card ${p.main ? 'main' : 'study'}${p.wide ? ' wide' : ''}`}>
              <div className="ih">
                <span className="ico" aria-hidden="true">
                  <ItemIcon icon={p.icon} />
                </span>
                <div>
                  <span className="tag">{p.kind}</span>
                  <h3>{p.name}</h3>
                </div>
              </div>
              <p>{p.summary}</p>
              <p className="flavor">{p.flavor}</p>
              {p.shot && (
                <div className="shot">
                  <img src={p.shot.src} alt={p.shot.alt} width={800} height={450} loading="lazy" decoding="async" />
                  <span className="cap">{p.shot.caption}</span>
                </div>
              )}
              {p.searchDemo && <SearchDemo />}
              <dl>
                {p.sheet.map(row => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              {p.note && <p className="ok">{p.note}</p>}
              {p.links.length > 0 && (
                <div className="links">
                  {p.links.map(l => (
                    <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
