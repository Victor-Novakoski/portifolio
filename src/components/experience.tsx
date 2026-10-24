import { useEffect, useRef } from 'react'

import { SectionHead } from '@/components/section-head'
import { regions } from '@/data/experience'
import { prefersReducedMotion } from '@/lib/motion'

export function Experience() {
  const mapRef = useRef<HTMLOListElement>(null)

  // As regiões do mapa acendem conforme entram na tela.
  useEffect(() => {
    const nodes = Array.from(mapRef.current!.children)
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      nodes.forEach(n => n.classList.add('lit'))
      return
    }
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('lit')
          observer.unobserve(entry.target)
        }),
      { rootMargin: '0px 0px -20% 0px' }
    )
    nodes.forEach(n => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="block wrap" id="experiencia" aria-labelledby="h-experiencia">
      <div className="inner">
        <SectionHead id="experiencia" sub="As regiões percorridas até aqui, da mais antiga à atual." />
        <ol className="map" ref={mapRef}>
          {regions.map(r => (
            <li key={r.id} className={r.now ? 'now' : undefined}>
              <span className="reg">{r.region}</span>
              <h3>{r.title}</h3>
              <span className="org">{r.org}</span>
              <span className="when">{r.when}</span>
              {r.summary && <p>{r.summary}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
